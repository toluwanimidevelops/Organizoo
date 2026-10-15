import Chat from "../models/Chat.schema.js";

export const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "UserId is required" });
    }
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.userId } } },
        { users: { $elemMatch: { $eq: req.userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
      
  } catch (error) {}
};
