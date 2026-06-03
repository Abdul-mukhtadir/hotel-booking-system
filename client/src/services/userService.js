import API from "./api";

export const getFavorites = async (token) => {
  const response = await API.get("/users/favorites", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const addFavorite = async (hotelId, token) => {
  const response = await API.post(
    `/users/favorites/${hotelId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const removeFavorite = async (hotelId, token) => {
  const response = await API.delete(`/users/favorites/${hotelId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};