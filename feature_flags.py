import json
import random
from pathlib import Path


class FeatureFlagManager:
    """Simple feature flag manager with percentage rollouts and kill switch."""

    def __init__(self, config_path: str = "feature_flags.json"):
        self.config_path = Path(config_path)
        self._load()

    def _load(self) -> None:
        if self.config_path.exists():
            with self.config_path.open() as f:
                self.flags = json.load(f)
        else:
            self.flags = {}

    def is_enabled(self, feature_name: str, user_id: str | None = None) -> bool:
        flag = self.flags.get(feature_name)
        if not flag:
            return False
        if flag.get("kill_switch"):
            return False
        rollout = flag.get("rollout", 0)
        if user_id is None:
            return random.random() * 100 < rollout
        bucket = hash(user_id) % 100
        return bucket < rollout

    def set_rollout(self, feature_name: str, percent: int) -> None:
        flag = self.flags.setdefault(feature_name, {})
        flag["rollout"] = percent
        self._save()

    def activate_kill_switch(self, feature_name: str) -> None:
        flag = self.flags.setdefault(feature_name, {})
        flag["kill_switch"] = True
        self._save()

    def deactivate_kill_switch(self, feature_name: str) -> None:
        flag = self.flags.setdefault(feature_name, {})
        flag["kill_switch"] = False
        self._save()

    def _save(self) -> None:
        with self.config_path.open("w") as f:
            json.dump(self.flags, f, indent=2)


if __name__ == "__main__":
    manager = FeatureFlagManager()
    feature = "newInvoiceUI"
    print(f"{feature} enabled for demo user:", manager.is_enabled(feature, user_id="demo"))
