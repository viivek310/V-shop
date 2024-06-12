import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from '@/connection';
import User from '@/models/user'
import bcrypt from "bcrypt"





export const authoptions = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        await connectDB()
        try {
          // console.log(credentials.username,"identifier")
          const user = await User.findOne({ username: credentials.username })
          if (!user) {
            throw new Error("Incorrect Username")
          }
          //  if(!user.isVerified){
          //   throw new Error("User not verified")
          //  }
          //  console.log(credentials.password,user.password)

          const isCorrect = await bcrypt.compare(credentials.password, user.password)
          if (isCorrect) {
            return user
          } else {
            throw new Error("Incorrect credentials")
          }
        } catch (error) {
          throw new Error(error)
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      // console.log(user,account,profile,email,credentials)
      if (account?.provider == "credentials") {
        return true
      }
      if (account?.provider == "google") {
        try {
     
          const userExist = await User.findOne({ username: user.name })
          if (!userExist) {
            const newUser = new User({
              username: user.name,
              oldEmail: user.email,
              email: user.email,
              password: "",
            })
            await newUser.save()
            return true
          }
          return true
        } catch (error) {
          console.log(error)
          return false
        }
      }
      if (account?.provider == "github") {
        connectDB()
        try {
          const userExist = await User.findOne({ username: user.name })
          if (!userExist) {
            const newUser = new User({
              username: user.name,
              oldEmail: user.email,
              email: user.email,
              password: "",
            })
            await newUser.save()
            return true
          }
          return true
        } catch (error) {
          console.log(error)
          return false
        }

      }

    },
  },
})

export { authoptions as GET, authoptions as POST }