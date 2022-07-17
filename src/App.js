import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [valor, setValor] = useState(0);
  const [planets, setPlanets] = useState('');
  const [searchName, setSearchName] = useState('');
  const [column, setColumn] = useState('population');
  const [options, setOptions] = useState(['population', 'orbital_period',
    'diameter', 'rotation_period', 'surface_water']);
  const [submitFilter, setSubmitFilter] = useState([]);
  const [planetsFilted, setPlanetsFilted] = useState('');
  const [comparison, setComparison] = useState('maior que');
  // useEffect save in Planets response API
  useEffect(() => {
    const planetsUrl = 'https://swapi-trybe.herokuapp.com/api/planets/';
    const planetsFetch = () => fetch(planetsUrl)
      .then((response) => response.json())
      .then(({ results }) => setPlanets(results));
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
    setPlanetsFilted(planets);
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
  }, [planets, submitFilter]);

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
      <tr
        data-testid="render-planets"
        key={ name }
      >
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
          name="column-filter"
          data-testid="column-filter"
          onChange={ ({ target }) => setColumn(target.value) }
          value={ column }
        >
          {options.map((e) => (
            <option key={ e } value={ e }>{e}</option>
          )) }
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
          onClick={ () => {
            const optionsFilted = () => options.splice(options.indexOf(column), 1);
            optionsFilted();
            setOptions(options);
            setSubmitFilter((state) => [...state, { filterByNumericValues:
            { column, comparison, value: Number(valor) } }]);
            setColumn(options[0]);
          } }
        >
          Filtrar

        </button>
      </forms>
      <section>
        {submitFilter && submitFilter.map(({
          filterByNumericValues },
        index) => (
          <div
            key={ index }
            data-testid="filter"
          >
            <p>
              { `Coluna: ${filterByNumericValues.column}
            Comparação: ${filterByNumericValues.comparison}
            Valor: ${filterByNumericValues.value}`}
            </p>
            <button
              type="button"
              onClick={ () => {
                const filters = submitFilter.slice();
                filters.splice(index, 1);
                setSubmitFilter(filters);
                setOptions((option) => [...option, filterByNumericValues.column]);
              } }
            >
              excloi
            </button>
          </div>
        ))}
        <button
          type="button"
          data-testid="button-remove-filters"
          onClick={ () => {
            submitFilter.forEach(({ filterByNumericValues }) => {
              setOptions((option) => [...option, filterByNumericValues.column]);
            });

            setSubmitFilter([]);
          } }
        >
          Remover todas filtragens

        </button>

      </section>
      <section>
        <table>
          <tr role="rowheader">
            <th role="columnheader">Name</th>
            <th role="columnheader">Rotation Period</th>
            <th role="columnheader">Orbital Period</th>
            <th role="columnheader">Diameter</th>
            <th role="columnheader">Climate</th>
            <th role="columnheader">Gravity</th>
            <th role="columnheader">Terrain</th>
            <th role="columnheader">Surface Water</th>
            <th role="columnheader">Population</th>
            <th role="columnheader">Films</th>
            <th role="columnheader">Created</th>
            <th role="columnheader">Edited</th>
            <th role="columnheader">Url</th>
          </tr>

          {handleMapPlanets()}

        </table>
      </section>
    </body>
  );
}

export default App;
