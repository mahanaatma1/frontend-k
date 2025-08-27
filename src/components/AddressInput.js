'use client';

export default function AddressInput({ 
  address, 
  onChange, 
  className = '',
  showCountry = true 
}) {
  const handleChange = (field, value) => {
    const updatedAddress = {
      ...address,
      [field]: value
    };
    onChange(updatedAddress);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      <div className="md:col-span-2">
        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
          Street Address
        </label>
        <input
          type="text"
          id="street"
          name="street"
          value={address.street || ''}
          onChange={(e) => handleChange('street', e.target.value)}
          placeholder="Enter your street address"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={address.city || ''}
          onChange={(e) => handleChange('city', e.target.value)}
          placeholder="Enter your city"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
          State/Province
        </label>
        <input
          type="text"
          id="state"
          name="state"
          value={address.state || ''}
          onChange={(e) => handleChange('state', e.target.value)}
          placeholder="Enter your state"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {showCountry && (
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={address.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="Enter your country"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}
      
      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
          ZIP/Postal Code
        </label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          value={address.zipCode || ''}
          onChange={(e) => handleChange('zipCode', e.target.value)}
          placeholder="Enter your ZIP code"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}
