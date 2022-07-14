import React from 'react';
import { getByText, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import mockApi from './mock/mockApi';
import userEvent from '@testing-library/user-event';

describe('testes de renderizacao e filtro de tabelas', () => {
  const planetsWithT = [ 'Tatooine','Hoth', 'Coruscant']
  test('ao entrar na aolicacao deve realizar um fetch na API Starwars Planets',() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockApi),
    }));
    render(<App />);
    expect(global.fetch).toBeCalledWith('https://swapi-trybe.herokuapp.com/api/planets/');
  });
  test('se há uma tabela com 13 colunas e se ela é preencida com retorno da Api', () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockApi),
    }));
    render(<App />);
    const tablePlanets = screen.getByRole('table');
    expect(tablePlanets).toBeInTheDocument();
    const tableHead = screen.getByRole('rowheader');
    expect(tableHead).toBeInTheDocument();
    expect(tableHead.children.length).toBe(13);
    expect(tableHead.children[0].innerHTML).toEqual('Name')
    expect(tableHead.children[1].innerHTML).toEqual('Rotation Period')
    expect(tableHead.children[2].innerHTML).toEqual('Orbital Period')
    expect(tableHead.children[3].innerHTML).toEqual('Diameter')
    expect(tableHead.children[4].innerHTML).toEqual('Climate')
    expect(tableHead.children[5].innerHTML).toEqual('Gravity')
    expect(tableHead.children[6].innerHTML).toEqual('Terrain')
    expect(tableHead.children[7].innerHTML).toEqual('Surface Water')
    expect(tableHead.children[8].innerHTML).toEqual('Population')
    expect(tableHead.children[9].innerHTML).toEqual('Films')
    expect(tableHead.children[10].innerHTML).toEqual('Created')
    expect(tableHead.children[11].innerHTML).toEqual('Edited')
    expect(tableHead.children[12].innerHTML).toEqual('Url')
  });
  test('se existe um campo para filtrar pelo nome e quanto alterado filtra em tempo real', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockApi),
    }));
    render(<App />);
    const filterName = screen.getByTestId("name-filter");
    expect(filterName).toBeInTheDocument();
    const renderPlanetsWithT = await waitFor(() => screen.getAllByTestId("render-planets"))
    expect(renderPlanetsWithT.length).toEqual(10)
    userEvent.type(filterName, 't')
    expect(screen.getAllByTestId("render-planets").length).toEqual(3)
    expect(screen.getAllByTestId("render-planets")[0].children[0].innerHTML).toEqual(planetsWithT[0]);
    expect(screen.getAllByTestId("render-planets")[1].children[0].innerHTML).toEqual(planetsWithT[1]);
    expect(screen.getAllByTestId("render-planets")[2].children[0].innerHTML).toEqual(planetsWithT[2]);
  });
  test('se existe um forms para filtrar por caracteristicas numerica dos planetas', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(mockApi),
    }));
    render(<App />);
    await waitFor(() => screen.getAllByTestId("render-planets"))

    const selectColumn = screen.getByTestId("column-filter");
    const selectComparison = screen.getByTestId("comparison-filter");
    const inputValor = screen.getByTestId("value-filter");
    const btnSubmitComparison = screen.getByTestId("button-filter")
    expect(selectColumn).toBeInTheDocument()
    expect(selectComparison).toBeInTheDocument()
    expect(inputValor).toBeInTheDocument()
    expect(btnSubmitComparison).toBeInTheDocument()
    const listOfOptionSelectColumn = selectColumn.children
    const listOfOptionSelectComparison = selectComparison.children;
    expect(listOfOptionSelectColumn[0].innerHTML).toEqual("population");
    expect(listOfOptionSelectColumn[1].innerHTML).toEqual("orbital_period");
    expect(listOfOptionSelectColumn[2].innerHTML).toEqual("diameter");
    expect(listOfOptionSelectColumn[3].innerHTML).toEqual("rotation_period");
    expect(listOfOptionSelectColumn[4].innerHTML).toEqual("surface_water");

    expect(listOfOptionSelectComparison[0].innerHTML).toEqual("maior que");
    expect(listOfOptionSelectComparison[1].innerHTML).toEqual("menor que");
    expect(listOfOptionSelectComparison[2].innerHTML).toEqual("igual a");


    userEvent.selectOptions(selectColumn,'population');
    expect(selectColumn.value).toBe('population');
    userEvent.selectOptions(selectComparison,'maior que');
    expect(selectComparison.value).toBe('maior que');
    userEvent.type(inputValor,'{backspace}999999999999');
    expect(inputValor.value).toBe('999999999999');
    userEvent.click(btnSubmitComparison);
    const renderPlanets = await waitFor(() => screen.getAllByTestId("render-planets"));
    expect(renderPlanets.length).toBe(1);
    expect(screen.getAllByTestId("render-planets")[0].children[0].innerHTML).toBe('Coruscant');
  })
});
