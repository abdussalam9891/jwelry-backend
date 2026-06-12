import Collection from "../../models/collectionModel.js";

export const getAdminCollections =
  async (req, res) => {

    try {

      const collections =
        await Collection.find()

          .sort({
            sortOrder: 1,
            createdAt: -1,
          })

          .lean();

      res.json({

        success: true,

        collections,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });

    }

  };

export const createCollection =
  async (req, res) => {

    try {

      const {
        name,
        slug,
        description,
        bannerImage,
        isFeatured,
      } = req.body;

      const exists =
        await Collection.findOne({
          slug,
        });

      if (exists) {

        return res.status(400).json({
          message:
            "Collection already exists",
        });

      }

      const collection =
        await Collection.create({

          name,

          slug,

          description,

          bannerImage,

          isFeatured,

        });

      res.status(201).json({

        success: true,

        collection,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });

    }

  };

export const updateCollection =
  async (req, res) => {

    try {

      const collection =
        await Collection.findById(
          req.params.id
        );

      if (!collection) {

        return res.status(404).json({
          message:
            "Collection not found",
        });

      }

      const fields = [

        "name",

        "slug",

        "description",

        "bannerImage",

        "isFeatured",

        "isActive",

        "sortOrder",

      ];

      fields.forEach((field) => {

        if (
          req.body[field] !==
          undefined
        ) {

          collection[field] =
            req.body[field];

        }

      });

      await collection.save();

      res.json({

        success: true,

        collection,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });

    }

  };

export const deleteCollection =
  async (req, res) => {

    try {

      const collection =
        await Collection.findById(
          req.params.id
        );

      if (!collection) {

        return res.status(404).json({
          message:
            "Collection not found",
        });

      }

      await collection.deleteOne();

      res.json({

        success: true,

        message:
          "Collection deleted successfully",

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });

    }

  };

export const getCollectionById =
  async (req, res) => {

    try {

      const collection =
        await Collection.findById(
          req.params.id
        );

      if (!collection) {

        return res.status(404).json({
          message:
            "Collection not found",
        });

      }

      res.json({

        success: true,

        collection,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: error.message,
      });

    }

  };
