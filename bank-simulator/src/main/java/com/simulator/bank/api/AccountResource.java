package com.simulator.bank.api;

import com.simulator.bank.config.DataSourceFactory;
import com.simulator.bank.dao.AccountDAO;
import com.simulator.bank.dao.AccountJdbcDao;
import com.simulator.bank.dao.CustomerDao;
import com.simulator.bank.model.Account;
import com.simulator.bank.validation.AccountValidator;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Path("/accounts")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AccountResource {

    private final AccountDAO dao;

    private void validatePin(String accNum, Integer enteredPin) throws Exception {
    var accountOpt = dao.findByAccountNumber(accNum);

    if (accountOpt.isEmpty()) {
        throw new IllegalArgumentException("Account not found");
    }

    int customerId = accountOpt.get().getCustomerId();

    CustomerDao customerDao = new CustomerDao();
    var customer = customerDao.findById(customerId);

    if (customer == null)
        throw new IllegalArgumentException("Customer not found");

    if (customer.getPin() == null)
        throw new IllegalArgumentException("PIN not set");

    if (!customer.getPin().equals(enteredPin))
        throw new IllegalArgumentException("Invalid PIN");
}
    public AccountResource() {
        this.dao = new AccountJdbcDao(DataSourceFactory.getDataSource());
    }

    /** Return all accounts */
    @GET
    public Response listAll() throws SQLException {
        List<Account> list = dao.listAll();
        return Response.ok(list).build();
    }

    /** Fetch by account number */
    @GET
    @Path("/by-number/{accNumber}")
    public Response getByNumber(@PathParam("accNumber") String accNumber)
            throws SQLException {
        Optional<Account> opt = dao.findByAccountNumber(accNumber);
        return opt.map(Response::ok)
                  .orElseGet(() -> Response.status(Response.Status.NOT_FOUND))
                  .build();
    }

    /** Create */
    @POST
    public Response create(Account a) throws SQLException {
        try {
            AccountValidator.validate(a);
        } catch (IllegalArgumentException ex) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity("{\"error\":\"" + ex.getMessage() + "\"}")
                           .build();
        }
        int id = dao.create(a);
        a.setAccountId(id);
        return Response.status(Response.Status.CREATED).entity(a).build();
    }

    /** Update all fields by account number */
    @PUT
    @Path("/secure-update/{accNumber}")
    @Consumes("application/json")
    @Produces("application/json")
    public Response updateAccountSecure(@PathParam("accNumber") String accNumber,
                                        Map<String, Object> body) {
        try {
            Integer pin = Integer.parseInt(body.get("pin").toString());
    
            // ✅ Validate PIN
            validatePin(accNumber, pin);
    
            // ✅ GET EXISTING ACCOUNT (IMPORTANT FIX)
            var existingOpt = dao.findByAccountNumber(accNumber);
            if (existingOpt.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Account not found").build();
            }
    
            Account existing = existingOpt.get();
    
            // ✅ CREATE UPDATED OBJECT (KEEP customerId SAFE)
            Account updated = new Account();
    
            updated.setAccountNumber(accNumber);
            updated.setCustomerId(existing.getCustomerId());   // 🔥 VERY IMPORTANT FIX
    
            // 👉 Map updated fields
            updated.setAccountType((String) body.get("accountType"));
            updated.setBankName((String) body.get("bankName"));
            updated.setBranch((String) body.get("branch"));
            updated.setStatus((String) body.get("status"));
            updated.setIfscCode((String) body.get("ifscCode"));
            updated.setNameOnAccount((String) body.get("nameOnAccount"));
            updated.setPhoneLinked((String) body.get("phoneLinked"));
    
            if (body.get("balance") != null)
                updated.setBalance(new java.math.BigDecimal(body.get("balance").toString()));
    
            if (body.get("savingAmount") != null)
                updated.setSavingAmount(new java.math.BigDecimal(body.get("savingAmount").toString()));
    
            // ✅ CALL DAO
            boolean ok = dao.updateAccount(accNumber, updated);
    
            return ok
                    ? Response.ok(updated).build()
                    : Response.status(Response.Status.NOT_FOUND).build();
    
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(e.getMessage()).build();
        }
    }
   /*  @PUT
    @Path("/by-number/{accNumber}")
    public Response updateAccount(@PathParam("accNumber") String accNumber, Account updated)
            throws SQLException {
        try {
            AccountValidator.validate(updated);
        } catch (IllegalArgumentException ex) {
            return Response.status(Response.Status.BAD_REQUEST)
                           .entity("{\"error\":\"" + ex.getMessage() + "\"}")
                           .build();
        }
        boolean ok = dao.updateAccount(accNumber, updated);
        return ok ? Response.ok(updated).build()
                  : Response.status(Response.Status.NOT_FOUND).build();
    }*/

    /** Update only balance by account number */
    @PUT
    @Path("/by-number/{accNumber}/balance")
    @Consumes(MediaType.TEXT_PLAIN)
    public Response updateBalance(@PathParam("accNumber") String accNumber, String newBalance)
            throws SQLException {
        boolean ok = dao.updateBalance(accNumber, new java.math.BigDecimal(newBalance.trim()));
        return ok ? Response.ok().build()
                  : Response.status(Response.Status.NOT_FOUND).build();
    }

    /** Delete by account number */
    @DELETE
@Path("/secure-delete")
public Response deleteAccount(Map<String, Object> body) {
    try {
        String accNum = (String) body.get("account");
        Integer pin = Integer.parseInt(body.get("pin").toString());

        validatePin(accNum, pin);   // ✅ PIN CHECK

        boolean ok = dao.deactivateAccount(accNum);

        return ok ? Response.ok("Deleted successfully").build()
                  : Response.status(Response.Status.NOT_FOUND).build();

    } catch (Exception e) {
        return Response.status(Response.Status.BAD_REQUEST)
                .entity(e.getMessage()).build();
    }
}
   /* 
    @DELETE
    @Path("/by-number/{accNumber}")
    public Response deleteByAccountNumber(@PathParam("accNumber") String accNumber)
            throws SQLException {
        boolean ok = dao.deleteByAccountNumber(accNumber);
        return ok ? Response.noContent().build()
                  : Response.status(Response.Status.NOT_FOUND).build();
    }
                  */
}
