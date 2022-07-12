import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [valor, setValor] = useState(0);
  const [planets, setPlanets] = useState('');
  const [searchName, setSearchName] = useState('');
  const [column, setColumn] = useState('population');
  const [submitFilter, setSubmitFilter] = useState('');
  const [planetsFilted, setPlanetsFilted] = useState('');
  const [comparison, setComparison] = useState('maior que');
  const planetsUrl = 'https://swapi-trybe.herokuapp.com/api/planets/';

  // useEffect save in Planets response API
  useEffect(() => {
    const planetsFetch = () => fetch(planetsUrl)
      .then((response) => response.json())
      .then(({ results }) => setPlanets(results))
      .catch((err) => console.log(err));
    planetsFetch();
  }, []);

  useEffect(() => {
    setPlanetsFilted(planets);
    // filtro name
    if (searchName) {
      setPlanetsFilted(
        planets.filter((planet) => (
          planet.name.toLowerCase().includes(searchName.toLowerCase())
        )),
      );
    }
  }, [searchName, planets]);

  useEffect(() => {
    /* effect percorre a lista de filtros numericos e filtra sempre baseado na ultima
    lista atualizada de planetas, com um for each para percorrer os filtros e condicional
    que pega o ultimo state filtrado do planetsFilted e filtra baseado do filtro atual
    */
    if (submitFilter) {
      submitFilter.forEach((filtro) => {
        if (filtro.filterByNumericValues.comparison === 'maior que') {
          setPlanetsFilted((prevPlanets) => prevPlanets.filter((planet) => (
            Number(planet[filtro.filterByNumericValues.column])
          > filtro.filterByNumericValues.value
          )));
        } else if (filtro.filterByNumericValues.comparison === 'menor que') {
          setPlanetsFilted((prevPlanets) => prevPlanets.filter((planet) => (
            Number(
              planet[filtro.filterByNumericValues.column],
            ) < filtro.filterByNumericValues.value
          )));
        } else if (filtro.filterByNumericValues.comparison === 'igual a') {
          setPlanetsFilted((prevPlanets) => prevPlanets.filter((planet) => (
            Number(
              planet[filtro.filterByNumericValues.column],
            ) === filtro.filterByNumericValues.value
          )));
        }
      });
    }
  }, [submitFilter]);

  function handleMapPlanets() {
    // funçao que popula a tabela de planetas com um map usanto o state planetsFilted
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
        {/* Input filtro por nome, salva no state SearchName */}
        <input
          type="text"
          data-testid="name-filter"
          placeholder="Search Name"
          value={ searchName }
          onChange={ ({ target: { value } }) => setSearchName(value) }
        />
      </section>
      <forms>
        {/* Forms que add filtro numerico salvando em um objeto
        dentro do state SubmitFilter */}
        <select
          data-testid="column-filter"
          onChange={ ({ target }) => setColumn(target.value) }
          value={ column }
        >
          <option value="population">population</option>
          <option value="orbital_period">orbital_period</option>
          <option value="diameter">diameter</option>
          <option value="rotation_period">rotation_period</option>
          <option value="surface_water">surface_water</option>
        </select>
        <select
          data-testid="comparison-filter"
          onChange={ ({ target }) => setComparison(target.value) }
          value={ comparison }
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
        <input
          type="text"
          data-testid="value-filter"
          onChange={ ({ target }) => setValor(target.value) }
          value={ valor }
        />
        <button
          type="submit"
          data-testid="button-filter"
          onClick={ () => setSubmitFilter((state) => [...state, { filterByNumericValues:
            { column, comparison, value: Number(valor) } }]) }
        >
          Filtrar

        </button>
      </forms>
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
