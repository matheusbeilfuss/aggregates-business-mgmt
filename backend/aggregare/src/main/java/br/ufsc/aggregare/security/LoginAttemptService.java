package br.ufsc.aggregare.security;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class LoginAttemptService {

	private static final int MAX_ATTEMPT = 5;
	private static final int LOCK_MINUTES = 5;

	private final Map<String, Integer> userAttempts = new ConcurrentHashMap<>();
	private final Map<String, Integer> ipAttempts = new ConcurrentHashMap<>();

	private final Map<String, LocalDateTime> userLockTime = new ConcurrentHashMap<>();
	private final Map<String, LocalDateTime> ipLockTime = new ConcurrentHashMap<>();

	public void loginFailed(String username, String ip) {
		int userCount = userAttempts.compute(username,
				(k, v) -> (v == null ? 0 : v) + 1);

		if (userCount >= MAX_ATTEMPT) {
			userLockTime.put(username, LocalDateTime.now().plusMinutes(LOCK_MINUTES));
		}

		int ipCount = ipAttempts.compute(ip,
				(k, v) -> (v == null ? 0 : v) + 1);

		if (ipCount >= MAX_ATTEMPT) {
			ipLockTime.put(ip, LocalDateTime.now().plusMinutes(LOCK_MINUTES));
		}
	}

	public void loginSucceeded(String username, String ip) {
		userAttempts.remove(username);
		userLockTime.remove(username);

		ipAttempts.remove(ip);
		ipLockTime.remove(ip);
	}

	public boolean isBlocked(String username, String ip) {

		LocalDateTime now = LocalDateTime.now();

		LocalDateTime userLock = userLockTime.get(username);
		if (userLock != null) {
			if (userLock.isAfter(now)) {
				return true;
			} else {
				userLockTime.remove(username);
				userAttempts.remove(username);
			}
		}

		LocalDateTime ipLock = ipLockTime.get(ip);
		if (ipLock != null) {
			if (ipLock.isAfter(now)) {
				return true;
			} else {
				ipLockTime.remove(ip);
				ipAttempts.remove(ip);
			}
		}

		return false;
	}
}
