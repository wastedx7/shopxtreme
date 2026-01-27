package com.example.ecom.util;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RequestLoggingFilter implements Filter {
    
    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        long startTime = System.currentTimeMillis();
        String method = httpRequest.getMethod();
        String path = httpRequest.getRequestURI();
        
        logger.info(">>> {} {}", method, path);
        
        chain.doFilter(request, response);
        
        long duration = System.currentTimeMillis() - startTime;
        int status = httpResponse.getStatus();
        
        logger.info("<<< {} {} - Status: {} - Duration: {}ms", method, path, status, duration);
    }
}
