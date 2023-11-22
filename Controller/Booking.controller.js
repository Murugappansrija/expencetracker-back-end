const bookingRouter = require("express").Router();
const { default: mongoose } = require("mongoose");
const bookingModel = require("../Model/Booking.model");
const MoviesModel = require("../Model/Movies.model");
const UserModel = require("../Model/User.model");
const TheaterModel = require("../Model/Theater.model");

//To Book a Ticket
bookingRouter.post("/ticket", async function (req, res) {
  const { movie, date, seatNumber, user } = req.body;

  let existingMovie;
  let existingUser;
  let existingTheater;
  try {
    existingMovie = await MoviesModel.findById(movie);
    existingUser = await UserModel.findById(user);
    //existingTheater = await TheaterModel.findById(theater)
  } catch (error) {
    console.log(error);
  }
  if (!existingMovie) {
    return res.status(400).json({
      message: "Movie not found with ID",
    });
  }
  if (!existingUser) {
    return res.status(400).json({
      message: "User not found with ID",
    });
  }
  if (!existingTheater) {
    return res.status(400).json({
      message: "Movie not found with ID",
    });
  }
  let newBooking;

  try {
    newBooking = new bookingModel({
      movie,
      date: new Date(`${date}`),
      seatNumber,
      user,
      theater,
    });

    const session = await mongoose.startSession();
    session.startTransaction();
    existingMovie.bookings.push(newBooking);
    existingUser.bookings.push(newBooking);
   // existingTheater.bookings.push(newBooking);
    await existingMovie.save({ session });
    await existingUser.save({ session });
   // await existingTheater.save({ session });
    await newBooking.save({ session });
    session.commitTransaction();
  } catch (error) {
    console.log(error);
  }

  if (!newBooking) {
    return res.status(500).json({ message: "Error try again" });
  }
  return res.status(200).json({
    message: "Ticket booked Successfull",
    data: newBooking,
  });
});

//To get booking detail by ID
bookingRouter.get("/:id", async function (req, res) {
  const id = req.params.id;
  let booking;
  try {
    booking = await bookingModel.findById(id);
  } catch (error) {
    console.log(error);
  }
  if (!booking) {
    return res.status(500).json({
      message: "Unexpected Error",
    });
  }
  return res.status(200).json({
    data: booking,
  });
});

//To delete Booking detail
bookingRouter.delete("/:id", async function (req, res) {
  const id = req.params.id;
  let booking;
  try {
    booking = await bookingModel.findByIdAndRemove(id).populate("user movie");
   
    const session = await mongoose.startSession();
    session.startTransaction();
    await booking.user.bookings.pull(booking);
    await booking.movie.bookings.pull(booking);
    await booking.movie.save({ session });
    await booking.user.save({ session });
    session.commitTransaction();

  } catch (error) {
    console.log(error);
  }

  if (!booking) {
    return res.status(500).json({
      message: "unable to delete",
    });
  }
  return res.status(200).json({
    message: "Successfully Deleted",
  });
});

module.exports = bookingRouter;