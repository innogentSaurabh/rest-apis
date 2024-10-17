const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 8000;

// Connection with mongo DB
mongoose
  .connect("mongodb://127.0.0.1:27017/users-info")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error", err));

// Schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

//Middleware
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.send("Hey , Welcome to the node"));

app.get("/users", async (req, res) => {
  const allDBUsers = await User.find({});
  const html = `
    <ul>
        ${allDBUsers
          .map((user) => `<li> ${user.firstName} - ${user.email} </li>`)
          .join("")}
    </ul>
    `;
  return res.send(html);
});

app
  .route("/api/users")
  .get(async (req, res) => {
    const allDBUsers = await User.find({});
    return res.json(allDBUsers);
  })

  .post(async (req, res) => {
    const { body } = req;

    const result = await User.create({ ...body });
    return res.status(201).json({ msg: "User created successfully" });
  });

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      return res.json(user);
    } else {
      return res.send(`User with Id : ${id} does not exists.`);
    }
  })

  .patch(async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { ...body });
    return res.send(`User with Id : ${id} updated successfully`);
  })

  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    return res.json({
      status: "success",
      messsage: "User deleted successfully",
    });
  });

app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`));
