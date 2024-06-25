import Favorite from "./favorite.model.js";

export const getFavorite = async (req = request, res = response) => {
  const { limit, from } = req.query;
  const query = { status: true };

  try {
    const [total, favorites] = await Promise.all([
      Favorite.countDocuments(query),
      Favorite.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
      total,
      favorites,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error, the products could not be obtained",
    });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { noOwnerAccount, favorites } = req.body;

    const existingFavorite = await Favorite.findOne({ noOwnerAccount });

    if (existingFavorite) {
      const updatedFavorites = [...existingFavorite.favorites, ...favorites];
      await Favorite.findOneAndUpdate(
        { noOwnerAccount },
        { favorites: updatedFavorites },
        { new: true },
      );
    } else {
      const newFavorite = new Favorite({ noOwnerAccount, favorites });
      await newFavorite.save();
    }

    res.status(200).json({ message: "Favorite added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteFavorite = async (req, res) => {
  try {
    const { noOwnerAccount } = req.params;
    const updatedFavorite = await Favorite.findOneAndUpdate(
      { noOwnerAccount },
      { $set: { status: false } },
      { new: true },
    );
    if (updatedFavorite) {
      res.status(200).json({
        message: "Favorite deactivated successfully",
        updatedFavorite,
      });
    } else {
      res.status(404).json({ message: "Favorite not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const clearFavorite = async (req, res) => {
  const { noOwnerAccount } = req.params;

  try {
    const favoriteRecord = await Favorite.findOne({ noOwnerAccount });

    if (favoriteRecord) {
      // If the record exists, clear the favorites array
      favoriteRecord.favorites = [];
      await favoriteRecord.save();
      res.status(200).json({ message: "Favorites cleared successfully." });
    } else {
      // If no record exists for the given noOwnerAccount, send a message
      res.status(404).json({ message: "No favorites added." });
    }
  } catch (error) {
    console.error("Error clearing favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
