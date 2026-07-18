import Announcement from "../models/announcementModel.js";



export async function getAnnouncementBar() {
  const now = new Date();

  const announcement = await Announcement.findOne({
    deletedAt: null,
    status: "active",
    $and: [
      {
        $or: [
          { startDate: null },
          { startDate: { $lte: now } },
        ],
      },
      {
        $or: [
          { endDate: null },
          { endDate: { $gte: now } },
        ],
      },
    ],
  })
    .sort({
      isPinned: -1,
      priority: -1,
      createdAt: -1,
    })
    .lean();

  if (!announcement) {
    return null;
  }

  return {
    message: announcement.message,
    link: announcement.link,
  };
}

export async function getAnnouncementsForAdmin({
  page = 1,
  limit = 10,
  search = "",
  status = "all",
  type = "all",
  sort = "newest",
}) {
  const query = {
    deletedAt: null,
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  if (search.trim()) {
    query.$or = [
      {
        title: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        message: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  /* =========================================================
     FILTERS
  ========================================================= */

  if (status !== "all") {
    query.status = status;
  }

  if (type !== "all") {
    query.type = type;
  }

  /* =========================================================
     SORTING
  ========================================================= */

  const sortOptions = {
    newest: {
      createdAt: -1,
    },

    oldest: {
      createdAt: 1,
    },

    priority: {
      priority: -1,
      createdAt: -1,
    },

    titleAsc: {
      title: 1,
    },

    titleDesc: {
      title: -1,
    },

    startDate: {
      startDate: 1,
    },

    endDate: {
      endDate: 1,
    },
  };

  const sortOption =
    sortOptions[sort] ??
    sortOptions.newest;

  /* =========================================================
     PAGINATION
  ========================================================= */

  const pageNumber = Math.max(
    Number(page) || 1,
    1
  );

  const limitNumber = Math.max(
    Number(limit) || 10,
    1
  );

  const total =
    await Announcement.countDocuments(query);

  const totalPages = Math.max(
    Math.ceil(total / limitNumber),
    1
  );

  const currentPage = Math.min(
    pageNumber,
    totalPages
  );

  const announcements =
    await Announcement.find(query)
      .sort(sortOption)
      .skip((currentPage - 1) * limitNumber)
      .limit(Math.min(limitNumber, 100))
      .populate("createdBy", "name")
      .populate("updatedBy", "name")
      .lean();

  return {
    announcements,

    pagination: {
      page: currentPage,
      limit: limitNumber,
      total,
      totalPages,

      hasPrev: currentPage > 1,

      hasNext:
        currentPage < totalPages,
    },
  };
}

export async function getAnnouncementById(id) {
  const announcement = await Announcement.findById(id)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!announcement) {
    const error = new Error("Announcement not found.");
    error.statusCode = 404;
    throw error;
  }

  return announcement;
}

export async function createAnnouncement(data, userId) {


  if (
  data.startDate &&
  data.endDate &&
  new Date(data.startDate) > new Date(data.endDate)
) {
  const error = new Error(
    "End date must be after the start date."
  );
  error.statusCode = 400;
  throw error;
}


  const announcement = await Announcement.create({
   title: data.title.trim(),
message: data.message.trim(),
link: data.link?.trim() || "",
    type: data.type || "info",
    priority: data.priority ?? 1,
    status: data.status || "draft",
    startDate: data.startDate || null,
    endDate: data.endDate || null,
    isPinned: data.isPinned ?? false,
    createdBy: userId,
    updatedBy: userId,
  });

  return Announcement.findById(announcement._id)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");
}


export async function updateAnnouncement(id, updates, userId) {
  if (
    updates.startDate &&
    updates.endDate &&
    new Date(updates.startDate) >
      new Date(updates.endDate)
  ) {
    const error = new Error(
      "End date must be after the start date."
    );
    error.statusCode = 400;
    throw error;
  }

  const announcement =
    await Announcement.findById(id);

  if (!announcement) {
    const error = new Error(
      "Announcement not found."
    );
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = [
  "title",
  "message",
  "link",
  "type",
  "priority",
  "status",
  "startDate",
  "endDate",
  "isPinned",
];

for (const field of allowedFields) {
  if (field in updates) {
    announcement[field] = updates[field];
  }
}

  announcement.updatedBy = userId;

  await announcement.save();

  return Announcement.findById(id)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");
}


export async function deleteAnnouncement(id, userId) {
  const announcement =
    await Announcement.findById(id);

  if (!announcement) {
    const error = new Error(
      "Announcement not found."
    );
    error.statusCode = 404;
    throw error;
  }

announcement.deletedAt = new Date();
announcement.status = "archived";
announcement.updatedBy = userId;

await announcement.save();

  return {
    deletedId: id,
  };
}


export async function duplicateAnnouncement(id, userId) {
  const announcement = await Announcement.findById(id);

  if (!announcement) {
    const error = new Error("Announcement not found.");
    error.statusCode = 404;
    throw error;
  }

  const duplicate = await Announcement.create({
    title: `${announcement.title} (Copy)`,
    message: announcement.message,
    link: announcement.link,
    type: announcement.type,
    priority: announcement.priority,
    status: "draft",
    startDate: null,
    endDate: null,
    isPinned: false,
    createdBy: userId,
    updatedBy: userId,
  });

  return Announcement.findById(duplicate._id)
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");
}
