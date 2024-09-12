const express = require("express");
require("./database/connection");

const User = require("./schemas/User");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const users = await User.find();
  const names = users.map((user) => user.name);
  res.status(200).send(names);
});

app.get("/addUser", async (req, res) => {
  res.sendFile("public/addUsers.html", { root: __dirname });
});

app.get("/deleteUser", async (req, res) => {
  res.sendFile("public/deleteUsers.html", { root: __dirname });
});

app.get("/updateUser", async (req, res) => {
  res.sendFile("public/updateUsers.html", { root: __dirname });
});

app.post("/", async (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res.status(400).json({ msg: "Please provide a name" });
  }

  try {
    const newUser = new User({ name });
    await newUser.save();
    res.status(201).json({ msg: "User added successfully", User: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

app.delete("/", async (req, res) => {
  const name = req.body.name;

  if (!name) {
    return res.status(400).json({ msg: "Please provide a username" });
  }

  try {
    const result = await User.deleteOne({ name });
    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

app.patch("/", async (req, res) => {
  const { oldName, newName } = req.body;

  if (!oldName || !newName) {
    return res
      .status(400)
      .json({ msg: "Please provide both old and new names" });
  }
  try {
    const result = await User.updateOne({ name: oldName }, { name: newName });
    if (result.modifiedCount === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
