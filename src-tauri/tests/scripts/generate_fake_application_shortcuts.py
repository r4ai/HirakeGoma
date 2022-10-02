from distutils import extension
from msilib.schema import Shortcut
import pathlib
from unicodedata import category
from win32com.client import Dispatch
import os
import winshell
from faker import Faker
from faker.providers import file


def windows():
    fake = Faker()
    fake.add_provider(file)
    fake_folder_data_path = pathlib.Path.cwd().parent / "resources" / "fake_data"
    for _ in range(50):
        lnk_name = fake.file_name(extension='lnk')
        lnk_path = fake_folder_data_path / lnk_name
        lnk_target_path = fake.file_path(extension='exe')
        lnk_icon_path = fake.file_path(category='image')

        # shell = Dispatch('WScript.Shell')
        # lnk = shell.CreateShortCut(lnk_path)
        # Shortcut.Targetpath = lnk_target_path

        print(lnk_path)
        print(lnk_icon_path)


windows()
