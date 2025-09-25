import Vote from '../models/Vote.js';

export const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinResults', () => {
      socket.join('results');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Function to broadcast vote updates
  const broadcastResults = async () => {
    try {
      const results = await Vote.aggregate([
        {
          $group: {
            _id: '$option',
            count: { $sum: 1 }
          }
        }
      ]);

      const formattedResults = {
        optionA: 0,
        optionB: 0,
        optionC: 0,
        total: 0
      };

      results.forEach(result => {
        formattedResults[result._id] = result.count;
        formattedResults.total += result.count;
      });

      io.to('results').emit('resultsUpdate', formattedResults);
    } catch (error) {
      console.error('Error broadcasting results:', error);
    }
  };

  return { broadcastResults };
};