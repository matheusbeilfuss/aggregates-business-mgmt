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
		int userCount = userAttempts.getOrDefault(username, 0) + 1;
		userAttempts.put(username, userCount);

		if (userCount >= MAX_ATTEMPT) {
			userLockTime.put(username, LocalDateTime.now().plusMinutes(LOCK_MINUTES));
		}

		int ipCount = ipAttempts.getOrDefault(ip, 0) + 1;
		ipAttempts.put(ip, ipCount);

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
		return (userLockTime.containsKey(username) &&
				userLockTime.get(username).isAfter(LocalDateTime.now()))
				||
				(ipLockTime.containsKey(ip) &&
						ipLockTime.get(ip).isAfter(LocalDateTime.now()));
	}
}
