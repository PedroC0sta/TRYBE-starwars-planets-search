import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [planets, setPlanets] = useState('');
  const [searchName, setSearchName] = useState('');
  const [planetsFilted, setPlanetsFilted] = useState('');
  const planetsUrl = 'https://swapi-trybe.herokuapp.com/api/planets/';

  useEffect(() => {
    const planetsFetch = () => fetch(planetsUrl)
      .then((response) => response.json())
      .then(({ results }) => setPlanets(results))
      .catch((err) => console.log(err));
    planetsFetch();
  }, []);

  useEffect(() => {
    setPlanetsFilted(
      planets && planets.filter((planet) => (
        planet.name.toLowerCase().includes(searchName.toLowerCase())
      )),
    );
  }, [searchName, planets]);

  function handleMapPlanets() {
    return planetsFilted && planetsFilted.map(({
      rotation_period: rotationPeriod,
      orbital_period: orbitalPeriod,
      surface_water: surfaceWater,
      name, climate,
      gravity, terrain,
      diameter, population,
      films, created, edited, url,
    }) => (
      <tr key={ name }>
        <td>{ name }</td>
        <td>{ rotationPeriod }</td>
        <td>{ orbitalPeriod }</td>
        <td>{ diameter }</td>
        <td>{ climate }</td>
        <td>{ gravity }</td>
        <td>{ terrain }</td>
        <td>{ surfaceWater }</td>
        <td>{ population }</td>
        <td>{films.map((film, index) => <p key={ index }>{ film }</p>)}</td>
        <td>{ created }</td>
        <td>{ edited }</td>
        <td>{ url }</td>
      </tr>
    ));
  }

  return (
    <body>
      <section>
        <input
          type="text"
          data-testid="name-filter"
          placeholder="Search Name"
          value={ searchName }
          onChange={ ({ target: { value } }) => setSearchName(value) }
        />
      </section>
      <section>
        <table>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>Url</th>
          </tr>

          {handleMapPlanets()}

        </table>
      </section>
    </body>
  );
}

export default App;
