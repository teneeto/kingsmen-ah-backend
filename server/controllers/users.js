import passport from 'passport';
import models from '../models';
import { validateLogin, validateSignup, updateDetails } from '../validations/auth';
import { validationResponse, validateUniqueResponse } from '../helpers/validationResponse';
import getUserObject from '../helpers/getMinUserObject';
import Authorization from '../middlewares/Authorization';

const { User, DroppedToken } = models;

/**
 * @exports UserController
 * @class UserController
 * @description Handles Social Users
 * */
class UserController {
  /**
  * Create a new user
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async create(req, res, next) {
    try {
      const userDetails = await validateSignup(req.body);
      const user = await User.create(userDetails);

      return res.status(201).send({ status: 'success', message: 'User created successfully', user: getUserObject(user) });
    } catch (err) {
      if (err.isJoi && err.name === 'ValidationError') {
        return res.status(400).json({
          status: 400,
          errors: validationResponse(err)
        });
      }

      if (err.errors && err.errors[0].type === 'unique violation') {
        return res.status(400).json({
          status: 400,
          errors: validateUniqueResponse(err)
        });
      }
      next(err);
    }
  }

  /**
  * Login and Authenticate user.
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async login(req, res, next) {
    const { error } = validateLogin(req.body);
    if (error !== null) {
      const errorValue = error.details[0].message.replace(/\"/g, '');
      return res.status(400).json({ status: 400, error: errorValue });
    }
    passport.authenticate('local', { session: false }, (
      err,
      user,
      info
    ) => {
      if (err) {
        return next(err);
      }

      if (user) {
        return res.json({ user });
      }
      return res.status(400).json(info);
    })(req, res, next);
  }

  /**
  * Update user details
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async updateUser(req, res, next) {
    try {
      const { error } = updateDetails(req.body);
      if (error !== null) {
        const errorValue = error.details[0].message.replace(/\"/g, '');
        return res.status(400).json({ status: 400, error: errorValue });
      }

      const {
        username, email, bio, image, password
      } = req.body;

      const user = await User.findByPk(req.payload.id);

      if (!user) return res.status(400).json({ status: 400, message: 'User does not exists' });

      const updatedUserDetails = await user.update({
        username: username || user.username,
        email: email.toLowerCase() || user.email,
        bio: bio || user.bio,
        image: image || user.image,
        password: password || user.password
      });

      return res.send({ status: 'success', user: updatedUserDetails });
    } catch (err) {
      next(err);
    }
  }

  /**
  * Get user details
  * @async
  * @param  {object} req - Request object
  * @param {object} res - Response object
  * @param {object} next The next middleware
  * @return {json} Returns json object
  * @static
  */
  static async getUserDetails(req, res, next) {
    try {
      const user = await User.findByPk(req.payload.id);

      if (!user) {
        return res.sendStatus(400);
      }

      return res.send({ status: 'success', user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Signuout user and blacklist tokens
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object} res message
   */
  static async signOut(req, res) {
    const token = await Authorization.getToken(req);
    try {
      await DroppedToken.create({ token });
      return res.status(201).json({
        status: 201, message: 'You are now logged out'
      });
    } catch (error) {
      return res.status(401).json({
        status: 401, error: 'You need to login'
      });
    }
  }
}

export default UserController;
