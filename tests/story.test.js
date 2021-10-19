const supertest = require('supertest')
const mongoose = require("mongoose");
const app = require('../app')
const characterModel = require('../model/characterModel');
const locationModel = require('../model/locationModel');
const categoryModel = require('../model/categoryModel');
const storyModel = require('../model/storyModel');
const chapterModel = require('../model/chapterModel');

const characterOne = {
    _id:new mongoose.Types.ObjectId(),
    name:'Ashoka',
    dob:'200 BC',
    death:'154 BC',
    gender:'Male'
}
const locationOne = {
    _id:new mongoose.Types.ObjectId(),
    name:'Pataliputra',
    latitude:23.42,
    longitude:32.2,
    aliasName:['Patna']
}
const categoryOne = {
    _id:new mongoose.Types.ObjectId(),
    name:'Emperor',
    image:'image1'
}
const storyOne = {
    _id:new mongoose.Types.ObjectId(),
    storyName:'Ashoka the Great',
    language:'English',
    startYear:'189 BC',
    endYear:'154 BC',
    views:2,
    imageUrl:'image1',
    categoryId: categoryOne._id,
    locationId: locationOne._id,
    characterId: characterOne._id
}
const chapterOne = {
    _id:new mongoose.Types.ObjectId(),
    chapterName:'Birth of Ashoka',
    serialNumber:1,
    description:'Know how Ashoka mother met Bindusara',
    storyId: storyOne._id,
    imageUrl:'image1',
    storyUrl:'story.html'
}

beforeEach(async () => {
    jest.setTimeout(30000);
    await characterModel.deleteMany()
    await locationModel.deleteMany()
    await categoryModel.deleteMany()
    await storyModel.deleteMany()
    await chapterModel.deleteMany()

    await new characterModel(characterOne).save()
    await new locationModel(locationOne).save()
    await new categoryModel(categoryOne).save()
    await new storyModel(storyOne).save()
    await new chapterModel(chapterOne).save()
})

test('Test case for story controller',() => {

})


//Test case for creating character
test('Should save new character',async() => {
    await supertest(app).post('/story/character').send({
        name:'Bindusara',
        dob:'225 BC',
        death:'180 BC',
        gender:'Male'
    }).expect(200)
})

test('Should not save existing character',async() => {
    await supertest(app).post('/story/character').send({
        name:'Ashoka',
        dob:'225 BC',
        death:'180 BC',
        gender:'Male'
    }).expect(400)
})


//Test case for creating location
test('Should save new location',async() => {
    await supertest(app).post('/story/location').send({
        name:'Lanka',
        latitude:23.42,
        longitude:32.2,
        aliasName:['Sri lanka']
    }).expect(200)
})

test('Should not save existing location',async() => {
    await supertest(app).post('/story/location').send({
        name:'Pataliputra',
        latitude:23.42,
        longitude:32.2,
        aliasName:['Patna']
    }).expect(400)
})


//Test case for creating category
test('Should save new category',async() => {
    await supertest(app).post('/story/category').send({
        name:'Religious',
        image:'image4'
    }).expect(200)
})

test('Should not save existing category',async() => {
    await supertest(app).post('/story/category').send({
        name:'Emperor',
        image:'image2'
    }).expect(500)
})


//Test case for creating story
test('Should save new story',async() => {
    await supertest(app).post('/story/story').send({
        storyName:'Ramayana',
        language:'English',
        startYear:'189 BC',
        endYear:'154 BC',
        views:2,
        imageUrl:'image1',
        categoryId: categoryOne._id,
        locationId: locationOne._id,
        characterId: characterOne._id
    }).expect(200)
})

test('Should not save existing story',async() => {
    await supertest(app).post('/story/story').send({
        storyName:'Ashoka the Great',
        language:'English',
        startYear:'189 BC',
        endYear:'154 BC',
        views:2,
        imageUrl:'image1',
        categoryId: categoryOne._id,
        locationId: locationOne._id,
        characterId: characterOne._id
    }).expect(500)
})


//Test case for creating chapter
test('Should save new chapter',async() => {
    await supertest(app).post('/story/chapter').send({
        chapterName:'Birth of Ashoka',
        serialNumber:1,
        description:'Know how Ashoka mother met Bindusara',
        storyId: storyOne._id,
        imageUrl:'image1',
        storyUrl:'story.html'
    }).expect(200)
})


//Test case for fetching character
test('Successfully retriving character', async() => {
    await supertest(app).get('/story/character').send().expect(200)
})


//Test case for fetching location
test('Successfully retriving location', async() => {
    await supertest(app).get('/story/location').send().expect(200)
})


//Test case for fetching language of stories
test('Successfully retriving language of stories', async() => {
    await supertest(app).get('/story/language').send().expect(200)
})


//Test case for fetching category
test('Successfully retriving category', async() => {
    await supertest(app).get('/story/category').send().expect(200)
})


//Test case for fetching story
test('Successfully retriving story', async() => {
    await supertest(app).get('/story/story').send().expect(200)
    await supertest(app).get('/story/story?language=English').send().expect(200)
    await supertest(app).get(`/story/story?categoryId=${categoryOne._id}`).send().expect(200)
    await supertest(app).get('/story/story?language=Hindi').send().expect(400)
})


//Test case for fetching chapter
test('Successfully retriving chapter', async() => {
    await supertest(app).get('/story/chapter').expect(200)
    await supertest(app).get(`/story/chapter/${storyOne._id}`).expect(200)
})

test('Failure to retrive chapter', async() => {
    await supertest(app).get(`/story/chapter/${storyOne._id+1}`).expect(500)
})


//Test case for view of story
test('Incrementing the views of story', async() => {
    await supertest(app).patch(`/story/story/${storyOne._id}`).send().expect(200)
})

test('Adding story to user Watchlist',async() => {
    await supertest(app).patch(`/story/story/${storyOne._id}?emailId=dummy6@gmail.com`).send().expect(200)
})


//Test case for search
test('Should send story on successful search',async() =>{
    await supertest(app).get('/story/search?name=Ashoka').send().expect(200)
    await supertest(app).get('/story/search?name=Pataliputra').send().expect(200)
})

test('Should not send story for invalid search',async() =>{
    await supertest(app).get('/story/search?name=hello').send().expect(400)
})

test('Should not send story for empty search',async() =>{
    await supertest(app).get('/story/search').send().expect(400)
})


//Test case for popular
test('Should return popular story',async() => {
    await supertest(app).get('/story/popular').send().expect(200)
})


//Test case for recent
test('Should return recently added story',async() => {
    await supertest(app).get('/story/recent').send().expect(200)
})


//Test case for watchlist
test('Should return null for existing user',async() => {
    await supertest(app).get('/story/watchlist?emailId=dummy6@gmail.com').send().expect(200)
})

test('Should return error for invalid user',async() => {
    await supertest(app).get('/story/watchlist').send().expect(500)
})


//Test case for you-may-also-like
test('Should return empty for you may like stories for new user',async() => {
    await supertest(app).get('/story/youmaylike?emailId=dummy6@gmail.com').send().expect(500)
})