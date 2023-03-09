
const rd = require("./defaultDiacriticsRemoval")
const cheerio = require("cheerio");
const axios = require("axios");
const j2cp = require("json2csv").Parser;
const fs = require("fs");




async function getLinks(){
  try{
    const links = [];
 
      const url = "https://kinomaniak.cz/filmy/vse/databaze/#";
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const movies = $('body > div.container > span > table > tbody > tr > td.col-lg-3.col-md-5.col-sm-5.col-xs-5 > a');
      movies.each(function (){
        link = 'https://kinomaniak.cz' + $(this).attr('href');
  
  links.push({link});
      })
     

  const jsonString = JSON.stringify(links);
  fs.writeFile('./movies.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})
  }
  catch(error){
    console.error(error);
  }
}



async function getMovies(){
  try{
    const jsonString = fs.readFileSync('./movies.json');
    const mov = JSON.parse(jsonString);
    
    const list =[];
  for(var m of mov){
    const url = m.link;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    // left column of the page
    const title = $('body > div:nth-child(7) > div.row > div.col-md-8.col-xs-12 > div > div > div > div.col-md-7.col-xs-12 > h5').text();
    const premiera = $('').text();
    const distributor = $('').text();
    const zeme_vyroby = $('').text();
    const premiera_usa = $('').text();
    const zanr = $('').text();
    const rezie = $('').text();
    const herci = $('body > div:nth-child(7) > div.row > div.col-md-8.col-xs-12 > div > div > div > div.col-md-7.col-xs-12 > a:nth-child(22)').text();
    const imdb = $('body > div:nth-child(7) > div.row > div.col-md-8.col-xs-12 > div > div > div > div:nth-child(3) > div:nth-child(7) > div.col-xs-4.col-md-2.text-xs-center > h5 > span').text();
    const csfd = $('body > div:nth-child(7) > div.row > div.col-md-8.col-xs-12 > div > div > div > div:nth-child(3) > div:nth-child(8) > div.col-xs-4.col-md-2.text-xs-center > h5 > span').text();
    const left_column = $('body > div:nth-child(7) > div.row > div.col-md-8.col-xs-12 > div > div > div > div.col-md-7.col-xs-12').text().trim();
    // right column of the page
    const right_column = $('body > div:nth-child(7) > div.row > div.col-lg-4.col-md-4.col-sm-12.col-xs-12 > ul:nth-child(1)');
  
 
    const dat ={};
    dat.title=title
    right_column,$("body > div:nth-child(7) > div.row > div.col-lg-4.col-md-4.col-sm-12.col-xs-12 > ul > li").each(function (){
      const name = rd.removeDiacritics($(this).find("span small").text()).replace(/\s/g, '_').toLowerCase();
      const value = rd.removeDiacritics($(this).find("h5").text()).replace(/\s/g, '');
      dat[name]=value;
    })
console.log(dat);
  list.push(dat)
  const jsonS = JSON.stringify(dat);
  fs.appendFile('./scraped.json', jsonS, err => {
    if (err) {
        console.log('Error writing file', err)
    } else {
        console.log('Successfully wrote file')
    }
})

  }
console.log(list);

   
     

  }
  catch(error){
    console.error(error);
  }
}

getMovies();