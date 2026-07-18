import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  createAnnouncement,
  deleteAnnouncement,
  duplicateAnnouncement,
  getAnnouncementById,
  getAnnouncementsForAdmin,
  updateAnnouncement,
} from "../../service/announcementService.js";



export const getAdminAnnouncements = asyncHandler(async (req, res) => {
  const result = await getAnnouncementsForAdmin(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});



export const getAdminAnnouncementById = asyncHandler(async (req, res) => {
  const announcement = await getAnnouncementById(req.params.id);

  res.status(200).json({
    success: true,
    data: announcement,
  });
});



export const createAdminAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await createAnnouncement(
    req.body,
    req.user._id
  );

  res.status(201).json({
    success: true,
    data: announcement,
  });
});



export const updateAdminAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await updateAnnouncement(
    req.params.id,
    req.body,
    req.user._id
  );

  res.status(200).json({
    success: true,
    data: announcement,
  });
});


export const deleteAdminAnnouncement = asyncHandler(async (req, res) => {
  const result = await deleteAnnouncement(
    req.params.id,
    req.user._id
  );

  res.status(200).json({
    success: true,
    data: result,
  });
});



export const duplicateAdminAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await duplicateAnnouncement(
    req.params.id,
    req.user._id
  );

  res.status(201).json({
    success: true,
    data: announcement,
  });
});
