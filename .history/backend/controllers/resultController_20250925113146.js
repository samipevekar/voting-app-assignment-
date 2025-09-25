import Vote from '../models/Vote.js';

export const getResults = async (req, res) => {
  try {
    const results = await Vote.aggregate([
      {
        $group: {
          _id: '$option',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format results with all options
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

    res.json(formattedResults);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching results' });
  }
};