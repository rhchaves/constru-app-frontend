import HttpClient from 'src/common/boot/HttpClient';

// Apenas para exemplo de requisição

// //////////////////////////////////////////////////////
const teste = async ({ commit }, payload) => {
  commit('LOADING', true);

  await HttpClient.get('/app/menus', payload).then((response) => {
    commit('LIST_DATA', response.data.data);
    return response;
  })
    .finally(() => {
      commit('LOADING', false);
    });
};
// //////////////////////////////////////////////////////

export {
  teste,
};
