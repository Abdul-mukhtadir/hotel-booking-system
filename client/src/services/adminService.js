import API from "./api";

export const getAdminStats =
  async (token) => {
    const response =
      await API.get(
        "/admin/stats",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };