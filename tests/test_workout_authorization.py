def seed_muscle_group(db_session):
    from workouts.models import MuscleGroup
    mg = MuscleGroup(name="Chest")
    db_session.add(mg)
    db_session.commit()
    db_session.refresh(mg)
    return mg


def seed_exercise(db_session):
    from workouts.models import Exercise
    ex = Exercise(name="Bench Press")
    db_session.add(ex)
    db_session.commit()
    db_session.refresh(ex)
    return ex


def test_user_cannot_see_another_users_sessions(client, auth_headers, db_session):
    seed_muscle_group(db_session)

    user1_headers = auth_headers("user1@example.com")
    user2_headers = auth_headers("user2@example.com")

    client.post("/workouts/", json={
        "workout_date": "2026-01-01",
        "muscle_group_ids": [1]
    }, headers=user1_headers)

    response = client.get("/workouts/", headers=user2_headers)
    assert response.status_code == 200
    assert response.json() == []


def test_user_cannot_add_exercise_to_another_users_session(client, auth_headers, db_session):
    seed_muscle_group(db_session)
    seed_exercise(db_session)

    user1_headers = auth_headers("owner@example.com")
    user2_headers = auth_headers("attacker@example.com")

    session_resp = client.post("/workouts/", json={
        "workout_date": "2026-01-01",
        "muscle_group_ids": [1]
    }, headers=user1_headers)
    session_id = session_resp.json()["id"]

    response = client.post(f"/workouts/{session_id}/exercises", json={
        "exercise_id": 1
    }, headers=user2_headers)

    assert response.status_code == 404


def test_user_cannot_delete_another_users_session(client, auth_headers, db_session):
    seed_muscle_group(db_session)

    user1_headers = auth_headers("owner2@example.com")
    user2_headers = auth_headers("attacker2@example.com")

    session_resp = client.post("/workouts/", json={
        "workout_date": "2026-01-01",
        "muscle_group_ids": [1]
    }, headers=user1_headers)
    session_id = session_resp.json()["id"]

    response = client.delete(f"/workouts/{session_id}", headers=user2_headers)
    assert response.status_code == 404


def test_user_cannot_add_set_to_another_users_exercise(client, auth_headers, db_session):
    seed_muscle_group(db_session)
    seed_exercise(db_session)

    user1_headers = auth_headers("owner3@example.com")
    user2_headers = auth_headers("attacker3@example.com")

    session_resp = client.post("/workouts/", json={
        "workout_date": "2026-01-01",
        "muscle_group_ids": [1]
    }, headers=user1_headers)
    session_id = session_resp.json()["id"]

    we_resp = client.post(f"/workouts/{session_id}/exercises", json={
        "exercise_id": 1
    }, headers=user1_headers)
    we_id = we_resp.json()["id"]

    response = client.post(f"/workouts/workout-exercises/{we_id}/sets", json={
        "reps": 10, "weight": 60.0
    }, headers=user2_headers)

    assert response.status_code == 404


def test_owner_can_create_and_view_own_session(client, auth_headers, db_session):
    seed_muscle_group(db_session)
    seed_exercise(db_session)

    headers = auth_headers("legit@example.com")

    session_resp = client.post("/workouts/", json={
        "workout_date": "2026-01-01",
        "muscle_group_ids": [1]
    }, headers=headers)
    assert session_resp.status_code == 201
    session_id = session_resp.json()["id"]

    detail_resp = client.get(f"/workouts/{session_id}", headers=headers)
    assert detail_resp.status_code == 200
    assert detail_resp.json()["muscle_groups"][0]["name"] == "Chest"