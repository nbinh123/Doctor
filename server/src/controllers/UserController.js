const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

class UserController {

    //  [POST]  /login
    login = async (req, res, next) => {
        const { username, password } = req.body;

        // Kiểm tra xem người dùng có tồn tại không
        const user = await User
            .findOne({ username })
            .select('+password');
        if (!user) return res.status(400).json({
            message: 'User does not exist',
            status: 400,
        });

        // Kiểm tra mật khẩu (so sánh mật khẩu nhập vào với mật khẩu mã hóa trong DB)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({
            message: 'Invalid credentials',
            status: 400,
            hi: user.password,
            hi2: password
        });

        // Tạo JWT token
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({
            token: token,
            status: 200,
            id: user._id
        });
    }

    //  [POST]  /register
    register = async (req, res, next) => {
        try {
            const { name, email, username, password } = req.body;

            if (!email || !username || !password) {
                return res.status(400).json({
                    message: 'Missing required fields'
                });
            }

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    message: 'Username already exists'
                });

            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    message: 'Email already exists'
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                password: hashedPassword,
                email,
                name
            });

            await newUser.save();

            res.status(201).json({
                message: 'User registered successfully'
            });

        } catch (error) {
            next(error);
        }
    }

    //  [GET]   /get_information
    getInformation = async (req, res) => {
        try {
            const userID = req.user.id; // lấy từ JWT

            const user = await User.findById(userID).select("-password");

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                user,
                status: 200
            });
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    };

    /**
     * POST /api/users/:userId/observer
     * body: { observerId }
     */
    assignObserver = async (req, res) => {
        try {
            const { userId } = req.params;
            const { observerId } = req.body;

            if (!observerId) {
                return res.status(400).json({ message: 'observerId là bắt buộc' });
            }

            // User bị gán
            const targetUser = await User.findById(userId);
            if (!targetUser) {
                return res.status(404).json({ message: 'User không tồn tại' });
            }

            // Chỉ chính user hoặc admin
            if (
                req.user.id !== userId &&
                req.user.role !== 'admin'
            ) {
                return res.status(403).json({ message: 'Không có quyền gán observer' });
            }

            if (observerId === userId) {
                return res.status(400).json({ message: 'Không thể tự theo dõi chính mình' });
            }

            const observer = await User.findById(observerId);
            if (!observer) {
                return res.status(404).json({ message: 'Observer không tồn tại' });
            }

            targetUser.observer = observerId;
            await targetUser.save();

            res.json({
                message: 'Gán observer thành công',
                observer: {
                    id: observer._id,
                    username: observer.username,
                    email: observer.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    };

    /**
     * POST /api/users/:userId/verifier
     * body: { verifierId }
     */
    assignVerifier = async (req, res) => {
        try {
            const { userId } = req.params;
            const { verifierId } = req.body;

            if (!verifierId) {
                return res.status(400).json({ message: 'verifierId là bắt buộc' });
            }

            const targetUser = await User.findById(userId);
            if (!targetUser) {
                return res.status(404).json({ message: 'User không tồn tại' });
            }

            if (
                req.user.id !== userId &&
                req.user.role !== 'admin'
            ) {
                return res.status(403).json({ message: 'Không có quyền gán verifier' });
            }

            if (verifierId === userId) {
                return res.status(400).json({ message: 'Không thể tự xác nhận cho chính mình' });
            }

            const verifier = await User.findById(verifierId);
            if (!verifier) {
                return res.status(404).json({ message: 'Verifier không tồn tại' });
            }

            targetUser.verifier = verifierId;
            await targetUser.save();

            res.json({
                message: 'Gán verifier thành công',
                verifier: {
                    id: verifier._id,
                    username: verifier.username,
                    email: verifier.email
                }
            });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    };

    findUserByEmail = async (req, res) => {
        try {
            const { email } = req.query;

            if (!email) {
                return res.status(400).json({
                    message: 'Email là bắt buộc'
                });
            }

            const user = await User.findOne({
                email: email.toLowerCase()
            }).select('_id username email');

            if (!user) {
                return res.status(404).json({
                    message: 'Không tìm thấy user'
                });
            }

            res.json({
                id: user._id,
                username: user.username,
                email: user.email
            });
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi server'
            });
        }
    };

    findUserByUsername = async (req, res) => {
        try {
            const { username } = req.query;

            if (!username) {
                return res.status(400).json({
                    message: 'username là bắt buộc'
                });
            }

            const user = await User.findOne({
                username: username.trim()
            }).select('_id username email');

            if (!user) {
                return res.status(404).json({
                    message: 'Không tìm thấy user'
                });
            }

            res.json({
                id: user._id,
                username: user.username,
                email: user.email
            });
        } catch (error) {
            res.status(500).json({
                message: 'Lỗi server'
            });
        }
    };
    // DELETE /api/users/:userId/observer
    removeObserver = async (req, res) => {
        try {
            const { userId } = req.params;

            const targetUser = await User.findById(userId);
            if (!targetUser) {
                return res.status(404).json({ message: 'User không tồn tại' });
            }

            if (
                req.user.id !== userId &&
                req.user.role !== 'admin'
            ) {
                return res.status(403).json({ message: 'Không có quyền xoá observer' });
            }

            targetUser.observer = null;
            await targetUser.save();

            res.json({ message: 'Đã xoá observer' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    };

    // DELETE /api/users/:userId/verifier
    removeVerifier = async (req, res) => {
        try {
            const { userId } = req.params;

            const targetUser = await User.findById(userId);
            if (!targetUser) {
                return res.status(404).json({ message: 'User không tồn tại' });
            }

            if (
                req.user.id !== userId &&
                req.user.role !== 'admin'
            ) {
                return res.status(403).json({ message: 'Không có quyền xoá verifier' });
            }

            targetUser.verifier = null;
            await targetUser.save();

            res.json({ message: 'Đã xoá verifier' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    };

}

module.exports = new UserController;