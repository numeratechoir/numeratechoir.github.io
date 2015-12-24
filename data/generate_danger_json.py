from itertools import imap
from collections import namedtuple
import argparse
import csv
import json
import sys

def strip_char(s, c):
    return ''.join(s.split(c))

def strip_chars_factory(chars):
    def inner(s):
        for c in chars:
            s = strip_char(s, c)
        return s
    return inner

def wisqars_to_json(fname):
    data = {}
    with open(fname, 'rb') as csvfile:
         reader = csv.reader(csvfile, delimiter=',', quotechar='"')
         columns = next(reader)
         WisqarsRow = namedtuple("WisqarsRow", map(strip_chars_factory(' '), columns))
         for row in imap(WisqarsRow._make, reader):
             if row.Sex not in ["Males", "Females"]:
                 continue
             key = "%s-%s" % (row.Sex[0], row.AgeinYears)
             if row.Deaths == '.' or row.Population == '.':
                 break
             rate = float(row.Deaths) * 100000 / float(row.Population)
             data[key] = rate
    return data


def parse_overall_death_rates(fname, death_types):
    data = {}
    with open(fname, 'rb') as csvfile:
         reader = csv.reader(csvfile, delimiter="\t")
         columns = next(reader)
         i = 0
         for name in columns:
             if name == '':
                 columns[i] = "Column%d" % i
             i += 1

         OverallRow = namedtuple("OverallRow", map(strip_chars_factory(', ().'), columns))
         for row in imap(OverallRow._make, reader):
             for death_type in death_types:
                 for sex in ['Male', 'Female']:
                     value = getattr(row, '%s%sAdj' % (death_type, sex))
                     key = "%s-%s" % (sex[0], row.ExactAge)
                     if key not in data:
                         data[key] = {}
                     data[key][death_type] = float(value)
    return data


wisqar_death_types = [
    'cut_pierce',
    'drowning',
    'drug_poisoning',
    'fall',
    'fire',
    'firearm',
    'homicide',
    'machinery',
    'motor_vehicle',
    'motorcyclist',
    'natural_environmental',
    'nondrug_poisoning',
    'overexertion',
    'pedal_cyclist',
    'pedestrian',
    'residential_fire',
    'struck_by',
    'suffocation',
    'suicide',
    'terrorism',
    'transport_other',
    'transport_other_land',
]

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate the json file needed to show dangers.')
    parser.add_argument("-o", "--output", help="output file", default=0)
    args = parser.parse_args()

    sex_year_data = {}  # keyed on a sex/age string like so: 'M-32'

    # These are the data files in the data/wisqars directory
    for death_type in wisqar_death_types:
        wisqar_data = wisqars_to_json('wisqars/%s.csv' % death_type)
        for key, value in wisqar_data.iteritems():
            if key not in sex_year_data:
                sex_year_data[key] = {}
            sex_year_data[key][death_type] = value

    # This is the data in the data/overall_death_rate.csv file
    overall_death_data = parse_overall_death_rates('overall_death_rate.csv',
                                                   ['Cerebrovascular'])
    for key, data in overall_death_data.iteritems():
        if key not in sex_year_data:
            sex_year_data[key] = {}
        sex_year_data[key].update(data)

    with open(args.output, 'w') as outfile:
        json.dump(sex_year_data, outfile)
