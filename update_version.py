from pathlib import Path

CR = Path(__file__).resolve().parent

project_toml = CR.joinpath('pyproject.toml')


def get_version() -> list[int]:
    content = project_toml.read_text(encoding='utf8')
    import re

    versions = re.findall(r'version = "([0-9\.]+)"', content)
    if len(versions) == 0:
        print('cannot find version')
        exit(-1)

    if versions[0].count('.') != 3:  # year, month, day, rev
        print('incorrect version format')
        exit(-1)

    year, month, day, rev = versions[0].split('.')
    try:
        year = int(year)
        month = int(month)
        day = int(day)
        rev = int(rev)
    except ValueError:
        print('incorrect version format')
        exit(-1)

    return [year, month, day, rev]


def next_version(version: list[int]) -> str:
    year, month, day, rev = version
    new_version = [year, month, day, rev]
    import datetime

    now = datetime.datetime.now()
    if year == now.year and month == now.month and day == now.day:
        new_version[3] += 1
    else:
        new_version = [now.year, now.month, now.day, 0]

    return new_version


def str_version(version: list[int]) -> str:
    if isinstance(version, str):
        return version
    return '.'.join(map(str, version))


if __name__ == '__main__':
    version = get_version()
    nextv = next_version(version)

    nextv = str_version(nextv)

    project_toml.write_text(
        encoding='utf8',
        data=project_toml.read_text(encoding='utf8').replace(
            str_version(version), str_version(nextv)
        ),
    )

    import subprocess

    subprocess.run(['uv', 'build'], check=True)
    subprocess.run(
        [
            'twine',
            'upload',
            '--repository',
            'pypi',
            f'./dist/*-{nextv}.*',
            f'./dist/*-{nextv}-*',
        ],
        check=True,
    )

    # git_stat = subprocess.getoutput("git status")
    # if not "working tree clean" in git_stat:
    #     print("please commit your changes first")
    subprocess.run(['git', 'add', '.'], check=True)
    subprocess.run(['git', 'commit', '-m', f'bump version to {nextv}'])

    subprocess.run(['git', 'push'])

    subprocess.run(['git', 'tag', nextv], check=True)
    subprocess.run(['git', 'push', '--tags'])
