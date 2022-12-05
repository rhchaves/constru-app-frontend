import HttpClient from 'src/boot/HttpClient';
import Swal from 'sweetalert2';

// //////////////////////////////////////////////////////
const addNewProduct = async ({ commit }, payload) => {
  commit('LOADING', true);

  commit('INSERT_NEW_PRODUCT', payload);

  commit('LOADING', false);
};

// //////////////////////////////////////////////////////
const listAllProducts = async ({ commit }) => {
  commit('LOADING', true);
  setTimeout(() => {
    HttpClient.get('/product').then((response) => {
      const products = response.data;

      products.forEach((item) => {
        item.image = `/image/${item.image}`;
      // item.image = `/image/originais/${item.name}.jpg`;
      });
      commit('INSERT_LIST_PRODUCTS', products);
      return products;
    }).catch((error) => {
      console.log('Erro na requisição da lista', error);
    }).finally(() => {
      commit('LOADING', false);
    });
  }, 600);
};

// //////////////////////////////////////////////////////
const listAllFilteredProducts = async ({ commit }, payload) => {
  commit('LOADING', true);

  setTimeout(() => {
    HttpClient.get(`/categories/${payload.id}/products`).then((response) => {
      const categoryProducts = response.data.categories;
      categoryProducts.forEach((item) => {
        item.image = `/image/${item.image}`;
        // item.image = `/image/originais/${item.name}.jpg`;
      });
      commit('LIST_FILTER_PRODUCTS', categoryProducts);
    }).catch((error) => {
      console.log('Erro na requisição da lista', error);
    }).finally(() => {
      commit('LOADING', false);
    });
  }, 600);
};

// //////////////////////////////////////////////////////
const listTopSellingProducts = async ({ commit, state }) => {
  commit('LOADING', true);
  commit('CLEAR_TOP_SELLING_PRODUCTS');
  const productsList = state.products;
  productsList.filter((item) => {
    if (item.id <= 8) {
      commit('TOP_SELLER_PRODUCTS', item);
    }
    return item;
  });
  commit('LOADING', false);
};

// //////////////////////////////////////////////////////
const updateProduct = async ({ commit }, payload, user) => {
  commit('LOADING', true);

  console.log('payload', payload, user);
  console.log('payload e user', user);
  const payloadData = {
    id: payload.id,
    category: payload.category,
    name: payload.name,
    label: payload.label,
    description: payload.description,
    price: payload.price,
    mark: payload.mark,
    image: payload.image,
    update_by: user,
  };

  console.log('payloadData', payloadData);

  await HttpClient.patch(`/product/${payload.id}`, payloadData).then((response) => {
    console.log(payloadData);
    commit('CHANGE_PRODUCT', payload);
    return response;
  }).finally(() => {
    commit('LOADING', false);
  });
};

// //////////////////////////////////////////////////////
const deleteProduct = async ({ commit }, payload) => {
  commit('LOADING', true);

  payload.forEach((product) => HttpClient.delete(`/product/${product.id}`).then((response) => {
    commit('DELETE_PRODUCT', product);
    return response;
  }).finally(() => {
    commit('LOADING', false);
  }));
};

// //////////////////////////////////////////////////////
const blockProduct = async ({ commit }, payload) => {
  commit('LOADING', true);

  const product = payload[0];

  if (product.status === 0) {
    product.status = 1;
  } else {
    product.status = 0;
  }

  return HttpClient.patch(`/product/${payload[0].id}`, product).then((response) => {
    console.log('response.data', response.data);
    // commit('BLOCK_PRODUCT', product);
    return response;
  }).finally(() => {
    commit('LOADING', false);
  });
};
// //////////////////////////////////////////////////////
const resetCategoryProduct = async ({ commit }) => {
  commit('LOADING', true);
  setTimeout(() => {
    commit('CLEAR_LIST_FILTER_PRODUCTS');
    commit('LOADING', false);
  }, 600);
};

// //////////////////////////////////////////////////////
const filterProduct = async ({ commit }, payload) => {
  commit('LOADING', true);

  commit('CLEAR_LIST_FILTER_PRODUCTS');

  const filter = '?mark=&name&label=';
  HttpClient.get(`/products${filter + payload}`).then((response) => {
    const searchProduct = response.data.data;
    console.log('searchProduct', searchProduct);
    if (searchProduct.length === 0) {
      console.log('entrou no if');
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Não econtramos nenhum produto com essa descrição',
        showConfirmButton: false,
        timer: 4000,
      });
    } else {
      console.log('caiu no else');

      searchProduct.forEach((item) => {
        item.image = `/image/${item.image}`;
      });
      commit('LIST_FILTER_PRODUCTS', searchProduct);
    }
    return response;
  }).catch((error) => {
    console.log('Erro na requisição da lista', error);
  }).finally(() => {
    commit('LOADING', false);
  });
};

// //////////////////////////////////////////////////////

export {
  addNewProduct,
  listAllProducts,
  listAllFilteredProducts,
  listTopSellingProducts,
  updateProduct,
  deleteProduct,
  blockProduct,
  resetCategoryProduct,
  filterProduct,
};
