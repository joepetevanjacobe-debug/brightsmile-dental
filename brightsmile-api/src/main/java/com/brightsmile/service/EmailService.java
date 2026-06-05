package com.brightsmile.service;

import com.brightsmile.model.entity.Appointment;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Async
    public void sendBookingConfirmation(Appointment appointment) {
        try {
            Context ctx = new Context();
            ctx.setVariable("patientName", appointment.getPatientName());
            ctx.setVariable("serviceName", appointment.getService().getName());
            ctx.setVariable("doctorName", appointment.getDoctor().getUser().getName());
            ctx.setVariable("datetime", appointment.getStartDatetime()
                    .format(DateTimeFormatter.ofPattern("EEEE, MMMM d yyyy 'at' h:mm a")));
            ctx.setVariable("appointmentId", appointment.getId());
            ctx.setVariable("frontendUrl", frontendUrl);

            String html = templateEngine.process("email/booking-confirmation", ctx);
            sendHtmlEmail(appointment.getPatientEmail(), "Appointment Confirmed — BrightSmile Dental", html);
        } catch (Exception e) {
            log.error("Failed to send booking confirmation email", e);
        }
    }

    @Async
    public void sendReminder(Appointment appointment, String timeLabel) {
        try {
            Context ctx = new Context();
            ctx.setVariable("patientName", appointment.getPatientName());
            ctx.setVariable("serviceName", appointment.getService().getName());
            ctx.setVariable("doctorName", appointment.getDoctor().getUser().getName());
            ctx.setVariable("datetime", appointment.getStartDatetime()
                    .format(DateTimeFormatter.ofPattern("EEEE, MMMM d yyyy 'at' h:mm a")));
            ctx.setVariable("timeLabel", timeLabel);
            ctx.setVariable("frontendUrl", frontendUrl);

            String html = templateEngine.process("email/reminder", ctx);
            sendHtmlEmail(appointment.getPatientEmail(),
                    "Reminder: Your appointment is " + timeLabel + " — BrightSmile Dental", html);
        } catch (Exception e) {
            log.error("Failed to send reminder email", e);
        }
    }

    @Async
    public void sendCancellationEmail(Appointment appointment) {
        try {
            Context ctx = new Context();
            ctx.setVariable("patientName", appointment.getPatientName());
            ctx.setVariable("serviceName", appointment.getService().getName());
            ctx.setVariable("datetime", appointment.getStartDatetime()
                    .format(DateTimeFormatter.ofPattern("EEEE, MMMM d yyyy 'at' h:mm a")));
            ctx.setVariable("frontendUrl", frontendUrl);

            String html = templateEngine.process("email/cancellation", ctx);
            sendHtmlEmail(appointment.getPatientEmail(),
                    "Appointment Cancelled — BrightSmile Dental", html);
        } catch (Exception e) {
            log.error("Failed to send cancellation email", e);
        }
    }

    @Async
    public void sendVerificationEmail(String toEmail, String name, String token) {
        try {
            Context ctx = new Context();
            ctx.setVariable("name", name);
            ctx.setVariable("verifyUrl", frontendUrl + "/verify?token=" + token);

            String html = templateEngine.process("email/verify", ctx);
            sendHtmlEmail(toEmail, "Verify your BrightSmile account", html);
        } catch (Exception e) {
            log.error("Failed to send verification email", e);
        }
    }

    private void sendHtmlEmail(String to, String subject, String html)
            throws MessagingException, java.io.UnsupportedEncodingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromAddress, fromName);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        mailSender.send(message);
    }
}
