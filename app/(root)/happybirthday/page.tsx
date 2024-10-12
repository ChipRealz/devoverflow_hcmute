"use client"
import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card style={styles.card}>
          <CardHeader>
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <CardTitle>Happy Birthday!</CardTitle>
              <CardDescription>Wishing you a day filled with love and joy.</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.img 
              src="https://th.bing.com/th/id/OIP.7fWDiBrVWJ3w2Sp3S4mAnQHaHa?rs=1&pid=ImgDetMain" // replace with your image path or use an online link
              alt="Happy Birthday"
              style={styles.image}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <motion.p
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              May your birthday be as wonderful and amazing as you are!
            </motion.p>
          </CardContent>
          <CardFooter>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              With love, [Your Name]
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f3f4f6',
  },
  card: {
    width: '400px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 'auto',
    marginBottom: '20px',
  },
};

export default Page;
