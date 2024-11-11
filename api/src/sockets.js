import { pool } from './db.js';

// Socket.IO connection
const sockets = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Example: Listen for a new task event
        socket.on('addTask', async (taskName) => {
            console.log('Received taskName:', taskName);
        
            const status = 'pending';
            const timestamp = new Date();
        
            try {
                // Execute the insert query using async/await
                const [result] = await pool.execute(
                    'INSERT INTO tasks (NAME, TIMESTAMP, STATUS) VALUES (?, ?, ?)',
                    [taskName, timestamp, status]
                );
        
                // Create a task object to send back to the client
                const newTask = {
                    ID: result.insertId, // Changed `id` to `ID`
                    NAME: taskName,      // Updated field names to uppercase for consistency
                    STATUS: status,
                    TIMESTAMP: timestamp,
                };
        
                console.log('New Task Created:', newTask);
        
                // Emit the new task to all connected clients
                io.emit('taskAdded', newTask);
                console.log('Task added event emitted');
        
            } catch (error) {
                console.error('Error executing query:', error.message);
            }
        });
        
        socket.on('fetchTasks', async () => {
            try {
                const [rows] = await pool.query('SELECT ID, NAME, TIMESTAMP, STATUS FROM tasks');
                const tasks = rows.map(task => ({
                    ID: task.ID,
                    NAME: task.NAME,
                    TIMESTAMP: task.TIMESTAMP,
                    STATUS: task.STATUS,
                }));
                
                // Send the tasks back to the requesting client
                socket.emit('tasksFetched', tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error.message);
                socket.emit('error', 'Failed to fetch tasks');
            }
        });
        
        socket.on('toggleTask', async ({ id, completed }) => {
            try {
                // Update the task status in the database
                await pool.execute(
                    'UPDATE tasks SET STATUS = ? WHERE ID = ?',
                    [completed, id]
                );

                // Emit the updated task back to all clients
                const updatedTask = {
                    ID: id,
                    STATUS: completed,
                };
                io.emit('taskToggled', updatedTask);
                console.log('Task toggled event emitted:', updatedTask);
            } catch (error) {
                console.error('Error toggling task:', error.message);
            }
        });

        // New: Delete task
        socket.on('deleteTask', async (taskId) => {
            try {
                // Delete the task from the database
                await pool.execute(
                    'DELETE FROM tasks WHERE ID = ?',
                    [taskId]
                );

                // Emit the deleted task ID back to all clients
                io.emit('taskDeleted', taskId);
                console.log('Task deleted event emitted:', taskId);
            } catch (error) {
                console.error('Error deleting task:', error.message);
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};

export default sockets; // Export the sockets function