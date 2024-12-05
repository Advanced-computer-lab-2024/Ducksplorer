import axios from 'axios';
import { message } from 'antd';

const toggleCronJob = async (enable) => {
  try {
    const response = await axios.post('http://localhost:8000/toggle-cron', { enable });
    if (response.status === 200) {
      message.success(`Cron job ${enable ? "enabled" : "disabled"} successfully!`);
    } else {
      message.error("Failed to update cron job state.");
    }
  } catch (error) {
    console.error('Error toggling cron job:', error);
    message.error("An error occurred while updating the cron job.");
  }
};

// Buttons to toggle the cron job
<button onClick={() => toggleCronJob(true)}>Enable Cron Job</button>
<button onClick={() => toggleCronJob(false)}>Disable Cron Job</button>;
