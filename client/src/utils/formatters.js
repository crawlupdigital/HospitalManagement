export const formatCurrency = (val) => 
  `₹${parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatTime = (time) => {
  if (!time) return '-';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  return `${hour > 12 ? hour - 12 : hour || 12}:${m} ${ampm}`;
};

export const formatRelativeTime = (date) => {
  if (!date) return '-';
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 60000);
  if (diff < 1) return 'just now';
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

export const getToday = () => new Date().toISOString().split('T')[0];
