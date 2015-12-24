from itertools import imap
from collections import namedtuple
import argparse
import csv
import json
import sys

def strip_spaces(s):
    return ''.join(s.split(' '))

def wisqars_to_json(fname):
    data = {}
    with open(fname, 'rb') as csvfile:
         reader = csv.reader(csvfile, delimiter=',', quotechar='"')
         WisqarsRow = namedtuple("WisqarsRow", map(strip_spaces, next(reader)))
         for row in imap(WisqarsRow._make, reader):
             if row.Sex not in ["Males", "Females"]:
                 continue
             key = "%s-%s" % (row.Sex[0], row.AgeinYears)
             print >>sys.stderr, row.Deaths
             print >>sys.stderr, row.Population
             if row.Deaths == '.' or row.Population == '.':
                 break
             rate = float(row.Deaths) / float(row.Population)
             data[key] = rate
    return data


death_types = [
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
    for death_type in death_types:
        wisqar_data = wisqars_to_json('wisqars/%s.csv' % death_type)
        for key, value in wisqar_data.iteritems():
            if key not in sex_year_data:
                sex_year_data[key] = {}
            sex_year_data[key][death_type] = value
    
    with open(args.output, 'w') as outfile:
        json.dump(sex_year_data, outfile)
