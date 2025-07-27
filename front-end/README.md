# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

### Pages:

/            - main page
/admin       - admin page
/appoinments - empoloyee apointments
/login       - login page
/register    - registration page
/profile     - user profile



<div className="box">
          <h2 className="subtitle">Add New Service</h2>
          {addServiceMessage && (
            <div className="notification is-success">{addServiceMessage}</div>
          )}

          <form onSubmit={handleService}>
            {/* Service Name */}
            <div className="field">
              <label className="label">Service Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={serviceName}
                  onChange={e => setServiceName(e.target.value)}
                  placeholder="Enter service name"
                  required
                />
              </div>
            </div>

            {/* Duration */}
            <div className="field">
              <label className="label">Duration (minutes)</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  value={serviceDuration}
                  onChange={e => setServiceDuration(e.target.value)}
                  placeholder="Enter service duration"
                  required
                />
              </div>
            </div>

            {/* Price */}
            <div className="field">
              <label className="label">Price</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  step="0.01"
                  value={servicePrice}
                  onChange={e => setServicePrice(e.target.value)}
                  placeholder="Enter service price"
                  required
                />
              </div>
            </div>

            {/* Barbers Multiselect */}
            <div className="field">
              <label className="label">Barbers</label>
              <div className="control">
                <div className="select is-multiple">
                  <select
                    multiple
                    size={Math.min(4, barbers.length)}
                    value={selectedBarberIds}
                    onChange={e =>
                      setSelectedBarberIds(
                        Array.from(e.target.selectedOptions, o => Number(o.value))
                      )
                    }
                    required
                  >
                    {barbers.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-primary" type="submit">
                  Add Service
                </button>
              </div>
            </div>
          </form>
        </div>


        <div className="box">
          <h2 className="subtitle">Existing Services</h2>
          <table className="table is-fullwidth is-striped">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Barbers</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.duration} min</td>
                  <td>{service.price} zł</td>
                  <td>
                    {service.barbers && service.barbers.length > 0
                      ? service.barbers.map(b => b.name).join(', ')
                      : '—'}
                  </td>
                  <td>
                    <button
                      className="button is-small is-danger"
                      onClick={() => deleteService(service.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>