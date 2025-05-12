"use server";

import { userProps } from "@/types";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import { cookies } from 'next/headers';
import * as jose from 'jose';

export const createUser = async (formData: userProps) => {
  try {
    const { email, password, username } = formData;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        message: 'User already exists with this email',
        status: 400
      };
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name: username  
    });

    return {
      message: 'User created successfully. Kindly login to continue',
      status: 201
    };
  } catch (error: any) {
    return {
      message: 'Server error',
      error: error.message,
      status: 500
    };
  }
};

export const loginUser = async (formData: { email: string; password: string }) => {
  try {
    const { email, password } = formData;
    
    const user = await User.findOne({ email });
    if (!user) {
      return {
        message: 'Invalid email or password',
        status: 400
      };
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return {
        message: 'Invalid email or password',
        status: 400
      };
    }

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_key');
    const token = await new jose.SignJWT({ 
      id: user._id.toString(), 
      email: user.email 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);
    
    // Set HTTP-only cookie with the token
    (await cookies()).set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 // 1 hour
    });
    
    return {
      message: 'Logged in successfully',
      user: { id: user._id.toString(), email: user.email },
      token, // Include token in response for localStorage
      status: 200
    };
  } catch (error: any) {
    return {
      message: 'Server error',
      error: error.message,
      status: 500
    };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return {
        message: 'User not found',
        status: 404
      };
    }
    
    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name
      },
      status: 200
    };
  } catch (error: any) {
    return {
      message: 'Server error',
      error: error.message,
      status: 500
    };
  }
};

export const verifyAuth = async (token: string) => {
  try {
    if (!token) {
      return {
        success: false,
        message: 'No token provided'
      };
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    
    const { payload } = await jose.jwtVerify(token, secret);
    
    if (!payload.id || !payload.email) {
      return {
        success: false,
        message: 'Invalid token'
      };
    }
    
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }
    
    return { 
      success: true,
      user: { id: user._id.toString(), email: user.email }
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Invalid token'
    };
  }
};

// Logout action
export const logoutUser = async () => {
  // Clear the token cookie
  (await cookies()).set({
    name: 'token',
    value: '',
    expires: new Date(0)
  });
  
  return {
    message: 'Logged out successfully',
    status: 200
  };
};