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
}

export const addFavorite = async (req, res) => {
    try {
        const { noOwnerAccount, favorites } = req.body;

        const existingFavorite = await Favorite.findOne({ noOwnerAccount });

        if (existingFavorite) {
            const updatedFavorites = [...existingFavorite.favorites, ...favorites];
            await Favorite.findOneAndUpdate(
                { noOwnerAccount },
                { favorites: updatedFavorites },
                { new: true }
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

export const deleteFavoriteByIdOwnerAccount = async (req, res) => {
    try {
        const { noOwnerAccount } = req.params;
        const deletedFavorite = await Favorite.findOneAndDelete({ noOwnerAccount });
        res.status(200).json({ message: "Favorite deleted successfully", deletedFavorite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteAllFavorites = async (req, res) => {
    try {
        await Favorite.deleteMany();
        res.status(200).json({ message: "All favorites deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
};