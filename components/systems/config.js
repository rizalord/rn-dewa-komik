import AllGenre from '../controllers/Others/Genres/AllGenre';
import React from 'react';

const firebaseConfig = {
    apiKey: "AIzaSyBsWrrVVztp8dbaxSxklBviY0yTTmmLXos",
    authDomain: "dewa-komik-759ae.firebaseapp.com",
    databaseURL: "https://dewa-komik-759ae.firebaseio.com",
    projectId: "dewa-komik-759ae",
    storageBucket: "dewa-komik-759ae.appspot.com",
    messagingSenderId: "1010926695556",
    appId: "1:1010926695556:web:4c8380a1cb472582d9fed1",
    measurementId: "G-WLJP7EH3K2"
};

export const mobileApi = 'http://192.168.42.112:8000/api/mobile/';

export const genre = [
    "All",
    "4 - Koma",
    "Action",
    "Adventure",
    "Comedy",
    "Cooking",
    // "Demons",
    // "Drama",
    // "Ecchi",
    // "Fantasy",
    // "Game",
    // "Gender Bender",
    // "Harem",
    // "Historical",
    // "Horror",
    // "Isekai",
    // "Josei",
    // "Magic",
    // "Martial Art",
    // "Martial Arts",
    // "Mature",
    // "Mecha",
    // "Medical",
    // "Military",
    // "Music",
    // "Mystery",
    // "Police",
    // "Psychological",
    // "Reincarnation",
    // "Romance",
    //     "School",
    //     "School Life",
    //     "Sci - Fi",
    //     "Seinen",
    //     "Shoujo",
    //     "Shoujo Ai",
    //     "Shounen",
    //     "Shounen Ai",
    //     "Slice of Life",
    //     "Sports",
    //     "Super Power",
    //     "Supernatural",
    //     "Thriller",
    //     "Tragedy",
    //     "Vampire",
    //     "Webtoons",
    //     "Yuri",
];

export const anotherGenre = [
    "Demons",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Game",
    "Gender Bender",
    "Harem",
    "Historical",
    "Horror",
    "Isekai",
    "Josei",
    "Magic",
    "Martial Art",
    "Martial Arts",
    "Mature",
    "Mecha",
    "Medical",
    "Military",
    "Music",
    "Mystery",
    "Police",
    "Psychological",
    "Reincarnation",
    "Romance",
        "School",
        "School Life",
        "Sci - Fi",
        "Seinen",
        "Shoujo",
        "Shoujo Ai",
        "Shounen",
        "Shounen Ai",
        "Slice of Life",
        "Sports",
        "Super Power",
        "Supernatural",
        "Thriller",
        "Tragedy",
        "Vampire",
        "Webtoons",
        "Yuri",
]

export let genreItems = {};

// genre icon , color 
export const genreStat = [
    { 
        name : '4 - Koma',
        icon : 'solar-panel',
        color : '#000000'
    },
    {
        name: 'Action',
        icon: 'sword',
        color: '#E7B93E'
    },
    {
        name: 'Adventure',
        icon: 'earth',
        color: '#DD010C',
        
    },
    {
        name: 'Comedy',
        icon: 'laugh-squint',
        color: '#181A8F',
        vendor : 'FontAwesome5'
    },
    {
        name: 'Cooking',
        icon: 'pizza',
        color: '#e5893d',
    },
    {
        name: 'Demons',
        icon: 'emoticon-devil',
        color: '#680406',
    },
    {
        name: 'Drama',
        icon: 'drama-masks',
        color: '#9BD9E6',
    },
    {
        name: 'Ecchi',
        icon: 'emoticon-kiss',
        color: '#DA0312',
    },
    {
        name: 'Fantasy',
        icon: 'dragon',
        color: '#E04B00',
        vendor : 'FontAwesome5'
    },
    {
        name: 'Game',
        icon: 'gamepad-variant',
        color: '#02CCCC',
    },
    {
        name: 'Gender Bender',
        icon: 'gender-male-female',
        color: '#E7D803',
    },
    {
        name: 'Harem',
        icon: 'emoticon-cool',
        color: '#BA4CBF',
    },
    {
        name: 'Historycal',
        icon: 'emoticon-cool',
        color: '#0591E8',
    },
    {
        name: 'Horror',
        icon: 'ghost',
        color: '#020609',
    },
    {
        name: 'Isekai',
        icon: 'earth-box',
        color: '#E3D3AF',
    },
    {
        name: 'Josei',
        icon: 'gender-female',
        color: '#FF6666',
    },
    {
        name: 'Magic',
        icon: 'magic',
        color: '#760C78',
        vendor : 'FontAwesome5'
    },
    {
        name: 'Martial Art',  
        icon: 'hand-rock',
        color: '#DC0C1C',
        vendor: 'FontAwesome5'
    },
    {
        name: 'Mature',
        icon: 'human-male',
        color: '#A2060A',
    },
    {
        name: 'Mecha',
        icon: 'robot-industrial',
        color: '#0227B4',
    },
    {
        name: 'Medical',
        icon: 'syringe',
        color: '#E5B4B0',
        vendor: 'FontAwesome5'
    },
    {
        name: 'Military',
        icon: 'pistol',
        color: '#036C03',
    },
    {
        name: 'Music',
        icon: 'music',
        color: '#780B88',
    },
    {
        name: 'Mystery',
        icon: 'question',
        color: '#5D60BF',
    },
    {
        name: 'Psychological',
        icon: 'brain',
        color: '#510253',
    },
    {
        name: 'Reincarnation',
        icon: 'back-in-time',
        color: '#E87A21',
        vendor : 'Entypo'
    },
    {
        name: 'Romance',
        icon: 'heart',
        color: '#fe2240',
    },
    {
        name: 'School',
        icon: 'school',
        color: '#05CCD3',
    },
    {
        name: 'School Life',
        icon: 'chair-school',
        color: '#9ED6E3',
    },
    {
        name: 'Sci - Fi',
        icon: 'robot',
        color: '#0533C6',
    },
    {
        name: 'Seinen',
        icon: 'fire',
        color: '#DC000A',
    },
    {
        name: 'Shoujo',
        icon: 'heart-multiple',
        color: '#DC0879',
    },
    {
        name: 'Shoujo Ai',
        icon: 'female',
        color: '#DA0219',
        vendor : 'FontAwesome5'
    },
    {
        name: 'Shounen',
        icon: 'ninja',
        color: '#CD0C03',
    },
    {
        name: 'Shounen Ai',
        icon: 'human-male-male',
        color: '#B853BD',
    },
    {
        name: 'Slice of Life',
        icon: 'circle-slice-5',
        color: '#73BF27',
    },
    {
        name: 'Sports',
        icon: 'car-sports',
        color: '#E6D40E',
    },
    {
        name: 'Super Power',
        icon: 'superpowers',
        color: '#DC0E0E',
        vendor: 'FontAwesome5',
    },
    {
        name: 'Supernatural',
        icon: 'rowing',
        color: '#750686',
    },
    {
        name: 'Thriller',
        icon: 'emoticon-sad',
        color: '#000583',
    },
    {
        name: 'Tragedy',
        icon: 'emoticon-sad',
        color: '#1555D9',
    },
    {
        name: 'Vampire',
        icon: 'blood',
        color: '#1555D9',
        vendor : 'Fontisto'
    },
    {
        name: 'Webtoons',
        icon: 'toys',
        color: '#02CAAD',
    },
    {
        name: 'Yuri',
        icon: 'human-female-female',
        color: '#E5A0CF',
    },
    
]



export default firebaseConfig;