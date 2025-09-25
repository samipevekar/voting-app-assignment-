import Vote from '../models/Vote.js';

export const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinResults', () => {
      socket.join('results');
      console.log('User joined results room:', socket.id);
    });

    socket.on('newVote', async () => {
      console.log('New vote received, broadcasting update');
      await broadcastResults();
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

      // Calculate percentages
      formattedResults.optionAPercent = formattedResults.total > 0 
        ? ((formattedResults.optionA / formattedResults.total) * 100).toFixed(1)
        : 0;
      formattedResults.optionBPercent = formattedResults.total > 0 
        ? ((formattedResults.optionB / formattedResults.total) * 100).toFixed(1)
        : 0;
      formattedResults.optionCPercent = formattedResults.total > 0 
        ? ((formattedResults.optionC / formattedResults.total) * 100).toFixed(1)
        : 0;

      io.to('results').emit('resultsUpdate', formattedResults);
      console.log('Results broadcasted:', formattedResults);
    } catch (error) {
      console.error('Error broadcasting results:', error);
    }
  };

  return { broadcastResults };
};