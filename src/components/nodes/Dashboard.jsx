import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllBots, deleteBotByTitle } from '../api/botApi';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import SweetAlert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal); // Create a SweetAlert2 instance for React

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [botsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBots = async () => {
    try {
      setLoading(true);
      const response = await getAllBots();
      setBots(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bots:', err);
      toast.error('Failed to load bots. Please try again later.'); // Replaced alert with toast
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const filteredBots = useMemo(() => {
    return bots.filter(bot =>
      bot.startBotTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [bots, searchTerm]);

  const indexOfLastBot = currentPage * botsPerPage;
  const indexOfFirstBot = indexOfLastBot - botsPerPage;
  const currentBots = filteredBots.slice(indexOfFirstBot, indexOfLastBot);

  const totalPages = Math.ceil(filteredBots.length / botsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDeleteBot = async (title) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `You want to delete the bot "${title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteBotByTitle(title);
          console.log(`Attempting to show success toast for bot: ${title}`); // Diagnostic log
          toast.success(`Bot "${title}" deleted successfully!`); // Replaced alert with toast
          fetchBots(); // Refresh the list of bots after deletion
          // Reset to first page if current page becomes empty after deletion
          if (currentBots.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        } catch (err) {
          console.error('Error deleting bot:', err);
          toast.error(`Failed to delete bot "${title}". Please try again.`); // Replaced alert with toast
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        toast.info(`Deletion of bot "${title}" cancelled.`);
      }
    });
  };
   // ** NEW: Handle Edit Bot function **
  const handleEditBot = (botId) => {
    navigate(`/edit/${botId}`); // Navigate to the FlowBuilder with the bot ID
  };

  if (loading) {
    return (
      <div className="dashboard-container d-flex align-items-center justify-content-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Bot Dashboard</h2>
        <button className='btn btns btn-primary' onClick={() => navigate('/')}>
          <i className="fas fa-plus"></i> Create New Bot
        </button>
      </div>

      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search bots by title..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {filteredBots.length === 0 && searchTerm !== '' ? (
        <p className="no-results">No bots found matching "{searchTerm}".</p>
      ) : filteredBots.length === 0 ? (
        <p className="no-bots-message">No bots created yet. Click "Create New Bot" to get started!</p>
      ) : (
        <div className="table-responsive">
          <table className="bots-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Bot Title</th>
                <th>Created At</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBots.map((bot, index) => (
                <tr key={bot._id}>
                  <td>{(currentPage - 1) * botsPerPage + index + 1}</td>
                  <td>{bot.startBotTitle}</td>
                  <td>{moment(bot.createdAt).format('MMM Do, YYYY h:mm A')}</td>
                  <td>{moment(bot.updatedAt).format('MMM Do, YYYY h:mm A')}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-secondary edit-btn"
                      onClick={() => handleEditBot(bot._id)}
                      title="Edit Bot"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      className="btn btn-danger delete-btn"
                      onClick={() => handleDeleteBot(bot.startBotTitle)}
                      title="Delete Bot"
                    >
                      <i className="fas fa-trash-alt"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn pagination-btn"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`btn pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* ToastContainer for Dashboard specific toasts */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Dashboard;