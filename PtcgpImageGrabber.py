# This was created to save the images from the pokemon json file obtained from the scraper


# class Pokemon:
#     true_id = 0

#     def __init__(self, pkmn):
#         Pokemon.true_id += 1
#         self.true_id = Pokemon.true_id
#         self.id = pkmn["id"]
#         self.name = pkmn["name"]
#         self.rarity = pkmn["rarity"]
#         self.pack = pkmn["pack"]
#         self.health = pkmn["health"]
#         self.image = pkmn["image"]
#         self.fullart = pkmn["fullart"]
#         self.ex = pkmn["ex"]
#         self.artist = pkmn["artist"]

#     def __str__(self):
#         return f"#{self.true_id} {self.name}, EX: {self.ex}"

# fpath = 'C:\\Users\\HP\\Desktop\\chris\\Python Projects\\PokemonTcgpSort\\pokemon.json'

import json
import requests
import os

def main():
    # file = open(fpath, 'r', encoding='utf-8')
    # pokemonjson = file.read()
    # data = json.loads(pokemonjson)

    url = "https://raw.githubusercontent.com/chrisn5413/CARDS-PokemonPocket-scrapper/refs/heads/main/pokemon_cards.json"
    directory_name = "PokemonImages"
    
    data = getData(url)
    createFolder(directory_name)

    img_number = 0
    for pkmn in data:
        img_number += 1

        if img_number != 962: continue

        picture_url = pkmn['image']
        filename = f"{directory_name}/{img_number}.webp"

        with open(filename, 'wb') as handle:
            response = requests.get(picture_url, stream=True)

            if not response.ok:
                print(response)

            for block in response.iter_content(1024):
                if not block:
                    break

                handle.write(block)


def getData(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes (e.g., 404, 500)
        data = response.json()  # parse json response into python collection

        print(f"there are {len(data)} pokemon.")
        return data

    except requests.exceptions.RequestException as e:
        print(f"Error during request: {e}")
        quit(1)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        quit(1)

def createFolder(directory_name):
    try:
        os.mkdir(directory_name)
        print(f"Directory '{directory_name}' created successfully.")
    except FileExistsError:
        print(f"Directory '{directory_name}' already exists.")
    except PermissionError:
        print(f"Permission denied: Unable to create '{directory_name}'.")
    except Exception as e:
        print(f"An error occurred: {e}")
    
if __name__ == "__main__":
    main()

