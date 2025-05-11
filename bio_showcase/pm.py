from sodatools import Path, CD
import subprocess
import sys

cr = Path(__file__).resolve().parent


def run():
    with CD(cr):
        args = ['python', 'manage.py']
        args.extend(sys.argv[1:])
        subprocess.run(args, check=True)
