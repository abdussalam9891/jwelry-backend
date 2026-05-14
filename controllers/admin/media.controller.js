export const uploadImages =
  async (req, res) => {

    try {

      if (
        !req.files ||
        req.files.length === 0
      ) {

        return res.status(400).json({

          message:
            "No images uploaded",

        });

      }



      const uploadedImages =
        req.files.map((file) => ({

          url: file.path,

          public_id:
            file.filename,

        }));



      res.status(200).json({

        success: true,

        images: uploadedImages,

      });

    } catch (error) {

      console.error(error);



      res.status(500).json({

        message:
          "Image upload failed",

      });

    }

  };
