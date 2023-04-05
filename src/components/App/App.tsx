import React from "react";
import { pokemonData } from "../../data/pokemonData";
import { PokemonSchema, PokemonSpritesSchema, UnpatchedPokemonSchema } from "../../types/PokemonSchema";
import Pokedex from "../Pokedex/Pokedex";
import "./App.css";

interface AppState {
    searchField: string;
    allPokemons: PokemonSchema[];
    searchedPokemons: PokemonSchema[];
    selectedPokemon: PokemonSchema | undefined;
}



class App extends React.Component<any, AppState> {
    state = {
        searchField: "",
        allPokemons: [],
        searchedPokemons: [],
        selectedPokemon: undefined
    };

    patchPokemonData = (pokemons: UnpatchedPokemonSchema[]) => {
        const patchedPokenmons = pokemons.map((pokemon) => {
            let parsedSprites: PokemonSpritesSchema = {
                normal: undefined,
                animated: undefined
            };

            try {
                parsedSprites = pokemon.sprites && JSON.parse(pokemon.sprites);
            } catch (e) {
                console.log("exception wbile passing the sprites: ", e);
            }

            const patchedPokenmon: PokemonSchema = {
                ...pokemon,
                sprites: parsedSprites
            };

            return patchedPokenmon;
        });

        return patchedPokenmons
    }


    componentDidMount() {
        const patchedPokenmons: PokemonSchema[] = this.patchPokemonData(
            pokemonData
        );

        this.setState({
            allPokemons: patchedPokenmons,
            searchedPokemons: patchedPokenmons,
        })
    }


    handleInputChange = (inputValue: string) => {
        const { allPokemons } = this.state;

        const searchedPokemons = allPokemons.filter(
            (pokemon: PokemonSchema) => {
                return (
                    pokemon.name &&
                    pokemon.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                );
            }
        );

        this.setState({
            searchField: inputValue,
            searchedPokemons,
        });
    };

    handleClick = (pokemonName: string) => {
        const { allPokemons } = this.state;
        const selectedPokemon = allPokemons.find(
            (pokemon: PokemonSchema) => pokemon.name === pokemonName
        )

        this.setState({ selectedPokemon });
    }

    render() {
        return (<div className="App">
            <h1>Pokedex</h1>
            <Pokedex
                searchedPokemons={this.state.searchedPokemons}
                selectedPokemon={this.state.selectedPokemon}
                onInputChange={this.handleInputChange}
                onPokemonClick={this.handleClick}
            />
        </div>)
    }
}

export default App;