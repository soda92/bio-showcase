from sodatools import Path, CD
import subprocess
import sys

cr = Path(__file__).resolve().parent


def run():
    with CD(cr.parent):
        args = [sys.executable, 'manage.py']
        args.extend(sys.argv[1:])
        subprocess.run(args, check=True)


def runserver():
    with CD(cr.parent):
        args = [sys.executable, 'manage.py', 'runserver']
        subprocess.run(args, check=True)
