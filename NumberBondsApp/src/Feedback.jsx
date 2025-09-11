import React from "react";
import { motion } from "framer-motion";

const Feedback = ({ feedback }) => {
  return (
    <div className="text-center h-8 my-4 text-2xl font-semibold">
      {feedback.message && (
        <motion.p
          key={feedback.message}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={feedback.type === 'incorrect' ? 'text-red-500' : 'text-green-500'}
        >
          {feedback.message}
        </motion.p>
      )}
    </div>
  );
};

export default Feedback;