const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile model //
const Profile = require('../../models/Profile');
//Load User Profile //
const User = require('../../models/User');


// @route GET   api/pofile/test//
// @description Tests profile route//
// @access      public
router.get('/test', (req, res) => res.json({ msg: "profile Works" }));

// @route GET   api/pofile//
// @description Get current user profile //
// @access      private

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const errors = {};

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                if (!profile) {
                    errors.noprofile = 'There is no profile for this user';
                    return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route POST   api/pofile//
// @description create or edit user profile //
// @access      private

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        // Get fields // 
        const profilefields = {};
        profilefields.user = req.user.id;
        if (req.body.handle) profilefields.handle = req.body.handle;
        if (req.body.company) profilefields.company = req.body.company;
        if (req.body.website) profilefields.website = req.body.website;
        if (req.body.location) profilefields.location = req.body.location;
        if (req.body.bio) profilefields.bio = req.body.bio;
        if (req.body.status) profilefields.status = req.body.status;
        if (req.body.githubusername) profilefields.githubusername = req.body.githubusername;
        // skills - split into an array //
        if (typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }

        // social//
        profileFields.social = {};
        if (req.body.youtube) profilefields.social.youtube = req.body.youtube;
        if (req.body.twitter) profilefields.social.twitter = req.body.twitter;
        if (req.body.facebook) profilefields.social.facebook = req.body.facebook;
        if (req.body.instagram) profilefields.social.instagram = req.body.instagam;
        if (req.body.linkedin) profilefields.social.linkedin = req.body.linkedin;

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                if (profile) {
                    //update//
                    profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
                } else {
                    // create //
                }
            })

    }
);




module.exports = router;