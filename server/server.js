import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';

const engine = new Liquid({
  extname: '.liquid',
});

const app = new App();

app
  .use(logger())
  .use('/', sirv(process.env.NODE_ENV === 'development' ? 'client' : 'dist'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

app.get('/', async (req, res) => {
  const eredivisie = await fetch('https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Dutch%20Eredivisie')
  const eredivisieData = await eredivisie.json()

  const Bpl = await fetch('https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=English%20Premier%20League')
  const BplData = await Bpl.json()

  return res.send(renderTemplate('server/views/index.liquid', { title: 'Competities', eredivisieData: eredivisieData, BplData: BplData }));
  // return res.send(renderTemplate('server/views/index.liquid', { title: 'Premier league', BplData: BplData }));
});

app.get('/team/:strTeam/', async (req, res) => {
  const teamName = req.params.strTeam;
  const team = await fetch('https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=' + teamName)
 
  const teamData = await team.json()
  const actualTeamData = teamData.teams[0]
  
  
  return res.send(renderTemplate('server/views/detail.liquid', { title: `Team page for ${teamData.strTeam}`, teamData: actualTeamData}));
});

const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data
  };

  return engine.renderFileSync(template, templateData);
};


// const myHeaders = new Headers();
// myHeaders.append("Accept", "application/JSON");

// const requestOptions = {
//   method: "GET",
//   headers: myHeaders, 
//   redirect: "follow"
// };

// fetch("https://www.thesportsdb.com//api/v1/json/3/search_all_teams.php?l=Dutch%20Eredivisie", requestOptions)
//  .then((response) => response.json())
 
//  .then((result) =>
//   console.log(result.teams[0].strTeam))

//  .catch((error) => console.error(error));

 // const teamInfo = await fetch("https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Manchester_United")

 
//  Token code
//  CLZ3Pk9BmtmynH7l7b7x4bWuarw7cJ3O2ptuU1DQvfH3uvxHYyuARaPNwepO

// https://www.thesportsdb.com/free_sports_api
//https:www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Manchester_United

// Livescores
// https://www.football-data.org/coverage

