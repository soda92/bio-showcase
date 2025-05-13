from pathlib import Path

cwd = Path(__file__).resolve().parent
nginx_config = cwd / 'bio_showcase' / 'nginx.conf'


def collectstatic():
    import subprocess
    import sys

    subprocess.run(
        [sys.executable, 'manage.py', 'collectstatic', '--force-color', '--noinput'],
        check=True,
    )


def get_config() -> str:
    collectstatic()
    bio_static = cwd / 'bio_static'
    bio_media = cwd / 'bio_media'
    content = nginx_config.read_text(encoding='utf8')
    if not bio_static.exists():
        bio_static.mkdir()
    if not bio_media.exists():
        bio_media.mkdir()

    bio_static = str(bio_static).replace('\\', '/')
    bio_media = str(bio_media).replace('\\', '/')
    content = content.replace('{bio_static}', bio_static).replace(
        '{bio_media}', bio_media
    )
    return content
